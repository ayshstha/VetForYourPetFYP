import React from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";

export default function MyPassField({ label, name, control }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl variant="outlined" className="myForm" error={!!error}>
          <InputLabel htmlFor={`outlined-adornment-${name}`}>
            {label}
          </InputLabel>
          <OutlinedInput
            id={`outlined-adornment-${name}`}
            onChange={onChange}
            value={value}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={`toggle ${name} visibility`}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={label}
          />
          {error && (
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {error.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
