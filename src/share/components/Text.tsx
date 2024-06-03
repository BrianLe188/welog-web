import { TypeText, Typography, TypographyProps, styled } from "@mui/material";

interface ITextStyledProps {
    type?: keyof TypeText | "white";
}

interface ITextProps extends ITextStyledProps, TypographyProps {
    title: string;
}

export default function Text({
    title = "primary",
    type,
    ...props
}: ITextProps) {
    return (
        <TextStyled type={type} {...props}>
            {title}
        </TextStyled>
    );
}

const TextStyled = styled(Typography)<ITextStyledProps>(({ theme, type }) => ({
    color:
        type && type !== "white"
            ? theme.palette.text[type]
            : type === "white"
              ? "#fff"
              : theme.palette.text["primary"],
}));
