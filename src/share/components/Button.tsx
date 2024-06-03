import {
    ButtonProps,
    Button as MUIButton,
    Typography,
    styled,
} from "@mui/material";
import { ReactNode } from "react";

interface IButtonProps extends ButtonProps {
    name?: string;
    icon?: ReactNode;
}

export default function Button({
    name,
    icon,
    color = "primary",
    ...props
}: IButtonProps) {
    return (
        <ButtonStyled color={color} {...props}>
            {icon}
            {name && <Typography>{name}</Typography>}
        </ButtonStyled>
    );
}

const ButtonStyled = styled(MUIButton)(({ theme, color, disabled }) => {
    const styles: any = {
        padding: 15,
        borderRadius: 15,
        gap: 5,
    };

    if (!disabled) {
        switch (color) {
            case "primary":
                styles["color"] = "white";
                styles["backgroundColor"] = theme.palette.primary.main;
                styles["&:hover"] = {
                    backgroundColor: theme.palette.secondary.main,
                };
                break;
            case "success":
                styles["color"] = "white";
                styles["backgroundColor"] = theme.status.success.primary;
                styles["&:hover"] = {
                    backgroundColor: theme.status.success.secondary,
                };
                break;
        }
    } else {
        styles["backgroundColor"] = theme.status.disabled;
    }

    return styles;
});
