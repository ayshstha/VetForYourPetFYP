from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password  # For password hashing

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret


from django.contrib.auth.hashers import make_password
from .models import CustomUser  # Import your CustomUser model


class RegisterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)  # Optional field

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'password', 'full_name', 'phone_number', 'profile_picture')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Hash the password
        validated_data['password'] = make_password(validated_data['password'])

        # Create the user
        user = CustomUser.objects.create(**validated_data)

        return user

from .models import Adoption

class AdoptionSerializer(serializers.ModelSerializer):
    is_booked = serializers.BooleanField(read_only=True)
    has_pending_request = serializers.SerializerMethodField()
    
    class Meta:
        model = Adoption
        fields = '__all__'
        
    def get_has_pending_request(self, obj):
        # Check if any pending requests exist for this dog
        return AdoptionRequest.objects.filter(
            dog=obj, 
            status__in=['pending', 'approved']
        ).exists()

from .models import Feedback
class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ('id', 'message', 'created_at', 'user', 'featured')

    def get_user(self, obj):
        profile_picture_url = (
            self.context['request'].build_absolute_uri(obj.user.profile_picture.url)
            if obj.user.profile_picture else None
        )

        return {
            'id': obj.user.id,
            'full_name': obj.user.full_name,
            'profile_picture': profile_picture_url  # Full URL
        }
class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'profile_picture',]

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return self.context['request'].build_absolute_uri(obj.profile_picture.url)
        return None

class DogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adoption
        fields = ['id', 'name', 'image']

from. models import AdoptionRequest
# serializers.py
# serializers.py
class AdoptionRequestSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(
        choices=['pending', 'approved', 'rejected'], 
        required=False
    )
    dog = serializers.PrimaryKeyRelatedField(queryset=Adoption.objects.all(), write_only=True)
    dog_details = DogSerializer(source='dog', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = AdoptionRequest
        fields = [
            'id', 'user', 'user_details', 'dog', 'dog_details', 
            'pickup_date', 'status', 'created_at', 'adoption_reason'  # Add here
        ]
        read_only_fields = ['id', 'created_at', 'user']
        


from. models import RescueImage
from. models import RescueRequest
class RescueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RescueImage
        fields = ['image']

class RescueRequestSerializer(serializers.ModelSerializer):
    images = RescueImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    user_details = UserSerializer(source='user', read_only=True)  # Add this line
    class Meta:
        model = RescueRequest
        fields = [
            'id', 'user', 'user_details', 'description',  # Include user_details here
            'latitude', 'longitude', 'created_at', 'status', 
            'images', 'uploaded_images'
        ]
        read_only_fields = ['user', 'created_at', 'status']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        rescue_request = RescueRequest.objects.create(**validated_data)
        
        for image in uploaded_images:
            RescueImage.objects.create(rescue_request=rescue_request, image=image)
            
        return rescue_request
    
    
from. models import Appointment
class AppointmentSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    time = serializers.TimeField(format="%H:%M")
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'status']
        
    def create(self, validated_data):
        # Automatically set the user to the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
        
   # In serializers.py - AppointmentSerializer
def validate(self, data):
    date = data.get('date')
    time = data.get('time')
    
    # Check for active appointments only
    if Appointment.objects.filter(
        date=date, 
        time=time,
        status__in=['pending', 'confirmed']
    ).exists():
        raise serializers.ValidationError(
            "This time slot is already booked. Please choose another time."
        )
    return data