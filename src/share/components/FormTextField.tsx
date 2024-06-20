import { BaseTextFieldProps, TextField } from "@mui/material";
import { Control, Controller, FieldValues } from "react-hook-form";

interface IFormTextFieldProps extends BaseTextFieldProps {
    name: string;
    label?: string;
    control: Control<FieldValues | any> | undefined;
    required?: boolean;
}

export default function FormTextField({
    name,
    label,
    control,
    required = false,
    ...props
}: IFormTextFieldProps) {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required,
            }}
            render={({
                field: { onChange, value },
                fieldState: { error },
                formState,
            }) => (
                <TextField
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label={label}
                    {...props}
                />
            )}
        />
    );
}
