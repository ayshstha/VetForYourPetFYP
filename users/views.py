import requests
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import check_password
from .serializers import *
from .models import *
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.core.files.storage import default_storage
from knox.models import AuthToken
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.decorators import action

User = get_user_model()

class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)

            if user:
                _, token = AuthToken.objects.create(user)

                user_data = {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "phone_number": user.phone_number,
                    "is_superuser": user.is_superuser,  # Check if user is a superuser
                }

                if user.is_superuser:
                    user_data["role"] = "Admin"
                    user_data["message"] = "Welcome, Admin!"
                else:
                    user_data["role"] = "User"
                    user_data["message"] = "Welcome, User!"

                return Response({"user": user_data, "token": token})

            return Response({"error": "Invalid credentials"}, status=401)
        return Response(serializer.errors, status=400)


def csrf_token(request):
    # This view will return the CSRF token
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})


class RegisterViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)


# In views.py
class UserViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RegisterSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            # Return all users except superusers
            return CustomUser.objects.filter(is_superuser=False)
        return CustomUser.objects.filter(id=user.id)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        profile_picture_url = (
            request.build_absolute_uri(user.profile_picture.url)
            if user.profile_picture else None
        )

        user_data = {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "phone": user.phone_number,
            "profile_picture": profile_picture_url,  # Full URL
            "role": "Admin" if user.is_superuser else "User",
        }

        if user.is_superuser:
            all_users = CustomUser.objects.all().values("id", "full_name", "email")
            user_data["managed_users"] = list(all_users)

        return Response(user_data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not check_password(current_password, user.password):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_password:
            return Response(
                {"error": "New password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)  # Prevent session logout
        
        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        # Update fields if provided
        if "full_name" in data:
            user.full_name = data["full_name"]
        if "email" in data:
            user.email = data["email"]
        if "phone_number" in data:
            user.phone_number = data["phone_number"]
 
        # Handle profile picture upload
        if "profile_picture" in request.FILES:
            # Delete old profile picture if it exists
            if user.profile_picture:
                default_storage.delete(user.profile_picture.path)
            user.profile_picture = request.FILES["profile_picture"]

        user.save()
        return Response(
            {"message": "Profile updated successfully."},
            status=status.HTTP_200_OK,
        )


class AdminManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)
        
        # Admin-only logic here
        users = CustomUser.objects.all()
        serializer = RegisterSerializer(users, many=True)
        return Response(serializer.data)
    

from django.db.models import Exists, OuterRef

# views.py
class AdoptionViewSet(viewsets.ModelViewSet):
    queryset = Adoption.objects.filter(is_booked=False)  # Only show unbooked dogs
    serializer_class = AdoptionSerializer

from .models import Feedback
from .serializers import FeedbackSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            queryset = queryset.filter(featured=featured.lower() == 'true')
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    

class ToggleFeaturedFeedback(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, feedback_id):
        try:
            feedback = Feedback.objects.get(id=feedback_id)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

        # Toggle the featured status without any limit
        feedback.featured = not feedback.featured
        feedback.save()

        return Response({"message": "Feedback featured status toggled successfully", "featured": feedback.featured})

    
#
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import AdoptionRequest
from .serializers import AdoptionRequestSerializer
from rest_framework.exceptions import ValidationError

class AdoptionRequestViewSet(viewsets.ModelViewSet):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        dog = serializer.validated_data['dog']
        
        # Check for existing pending/approved requests
        if AdoptionRequest.objects.filter(dog=dog, status__in=['pending', 'approved']).exists():
            raise ValidationError("This dog already has an active request")
        
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['approved', 'rejected']:
            return Response(
                {"error": "Invalid status. Use 'approved' or 'rejected'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle approval
        if new_status == 'approved':
            # Mark dog as booked and reject others
            instance.dog.is_booked = True
            instance.dog.save()
            AdoptionRequest.objects.filter(
                dog=instance.dog,
                status='pending'
            ).exclude(id=instance.id).update(status='rejected')
        
        # Handle rejection
        elif new_status == 'rejected':
            # Only unbook if no other approved requests exist
            if not AdoptionRequest.objects.filter(
                dog=instance.dog,
                status='approved'
            ).exists():
                instance.dog.is_booked = False
                instance.dog.save()
        
        # Send email notification
        self.send_status_email(instance, new_status)
        
        instance.status = new_status
        instance.save()
        
        return Response(self.get_serializer(instance).data)

    def send_status_email(self, instance, status):
        context = {
            'user': instance.user,
            'dog_name': instance.dog.name,
            'pickup_date': instance.pickup_date.strftime("%B %d, %Y"),
            'organization_name': 'Vet For Your Pet'
        }

        template_map = {
            'approved': 'backend/adoption_approved.html',
            'rejected': 'backend/adoption_rejected.html'
        }

        subject_map = {
            'approved': f"Adoption Approved for {instance.dog.name}!",
            'rejected': f"Adoption Decision for {instance.dog.name}"
        }

        try:
            html_message = render_to_string(template_map[status], context)
            plain_message = strip_tags(html_message)

            msg = EmailMultiAlternatives(
                subject=subject_map[status],
                body=plain_message,
                from_email=settings.EMAIL_HOST_USER,
                to=[instance.user.email],
                reply_to=[settings.DEFAULT_FROM_EMAIL]
            )
            msg.attach_alternative(html_message, "text/html")
            msg.send()
            print(f"Successfully sent {status} email to {instance.user.email}")
        except Exception as e:
            print(f"Error sending {status} email to {instance.user.email}: {str(e)}")
          
    def get_queryset(self):
        if self.request.user.is_superuser:
            # Return ALL requests for admins
            return AdoptionRequest.objects.all()
        # For regular users, return their own requests
        return AdoptionRequest.objects.filter(user=self.request.user)
    
class RescueRequestViewSet(viewsets.ModelViewSet):
    queryset = RescueRequest.objects.all()
    serializer_class = RescueRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            # Return ALL rescue requests for admins
            return RescueRequest.objects.all().order_by('-created_at')
        # For regular users, return their own rescue requests
        return RescueRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class UpdateRescueRequestStatus(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        try:
            rescue_request = RescueRequest.objects.get(id=request_id)
        except RescueRequest.DoesNotExist:
            return Response({"error": "Rescue request not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['rescued', 'declined']:
            return Response({"error": "Invalid status. Use 'rescued' or 'declined'."}, status=status.HTTP_400_BAD_REQUEST)

        rescue_request.status = new_status
        rescue_request.save()

        return Response({"message": f"Rescue request status updated to {new_status}"}, status=status.HTTP_200_OK)
    

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        # Save the appointment and get the instance
        appointment = serializer.save(user=self.request.user)
        
        # Prepare email context
        context = {
            'user': appointment.user,
            'pet_name': appointment.pet_name,
            'date': appointment.date.strftime("%B %d, %Y"),
            'time': appointment.time.strftime("%I:%M %p"),
            'checkup_type': appointment.checkup_type,
        }

        # Render email templates
        html_message = render_to_string('backend/appointment_confirmation.html', context)
        plain_message = strip_tags(html_message)

        # Create and send email
        try:
            msg = EmailMultiAlternatives(
                subject=f"Appointment Confirmed for {appointment.pet_name}",
                body=plain_message,
                from_email=settings.EMAIL_HOST_USER,
                to=[appointment.user.email]
            )
            msg.attach_alternative(html_message, "text/html")
            msg.send()
        except Exception as e:
            print(f"Error sending confirmation email: {e}")
  
    def get_queryset(self):
        user = self.request.user
        date = self.request.query_params.get('date')
        
        # Base queryset - user-specific unless admin
        if user.is_superuser:
            queryset = Appointment.objects.all()
        else:
            queryset = Appointment.objects.filter(user=user)
        
        # Date filtering
        if date:
            queryset = queryset.filter(date=date)
            
        return queryset.order_by('-date', '-time')
    
      

    @action(detail=False, methods=['get'])
    def booked_slots(self, request):
        date = request.query_params.get('date')
        if not date:
            return Response({"error": "Date parameter is required"}, status=400)
        
        # Exclude completed, incomplete, and cancelled appointments
        appointments = Appointment.objects.filter(date=date).exclude(
            status__in=['cancelled', 'completed', 'incomplete']
        )
        booked_slots = [appointment.time.strftime("%H:%M") for appointment in appointments]
        return Response({"booked_slots": booked_slots})

# In views.py, update UpdateAppointmentStatus
# In views.py
class UpdateAppointmentStatus(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)

        new_status = request.data.get('status')
        allowed_statuses = ['confirmed', 'cancelled', 'completed', 'incomplete']
        
        if new_status not in allowed_statuses:
            return Response(
                {"error": f"Invalid status. Allowed: {', '.join(allowed_statuses)}"},
                status=400
            )

        # Update status
        appointment.status = new_status
        appointment.save()
        
        return Response({
            "message": f"Status updated to {new_status}",
            "appointment_id": appointment.id,
            "date": appointment.date,
            "time": appointment.time
        })

class KhaltiInitiateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        amount = data.get("amount")
        purchase_order_id = data.get("purchase_order_id")
        purchase_order_name = data.get("purchase_order_name")
        return_url = data.get("return_url")  # Get return_url from frontend

        if not all([amount, purchase_order_id, purchase_order_name, return_url]):
            return Response(
                {"error": "Missing required fields"},
                status=status.HTTP_400_BAD_REQUEST
            )

        headers = {
            "Authorization": "Key d69a39fcfed94ef59506af0cb7021183"  # test key
        }

        payload = {
            "return_url": return_url,  # Use frontend-provided URL
            "website_url": return_url,
            "amount": int(amount),
            "purchase_order_id": purchase_order_id,
            "purchase_order_name": purchase_order_name,
            "customer_info": {
                "name": data.get("customer_name", "Customer"),
                "email": data.get("customer_email", "customer@example.com"),
                "phone": data.get("customer_phone", "9800000000")
            }
        }

        try:
            response = requests.post(
                "https://dev.khalti.com/api/v2/epayment/initiate/",
                json=payload,
                headers=headers,
                timeout=10  # Add timeout
            )
            response.raise_for_status()  # Raises exception for 4XX/5XX responses
            return Response(response.json())
            
        except requests.exceptions.RequestException as e:
            print(f"Khalti API Error: {str(e)}")
            return Response(
                {"error": "Failed to initiate payment with Khalti"},
                status=status.HTTP_400_BAD_REQUEST
            )