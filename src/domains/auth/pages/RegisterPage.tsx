import { GithubIcon, GoogleIcon } from "@/assets/icons";
import Button from "@/share/components/Button";
import FormTextField from "@/share/components/FormTextField";
import Text from "@/share/components/Text";
import { Box, Stack } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { register } from "../services/AuthService";
import { onSetMessageSubscription, useAlert } from "@/zustand/useAlert";
import { SIGN_UP, SIGN_UP_WITH_GOOGLE } from "@/share/constants/message";
import { useNavigate } from "react-router-dom";

const defaultRegisterValue = {
    email: "",
    password: "",
};

interface IRegisterData {
    email: string;
    password: string;
}

export default function RegisterPage() {
    /**
     * Subscriptions
     */
    const alertSetMessageSubscription = useAlert(onSetMessageSubscription);

    /**
     * Hooks
     */
    const { handleSubmit, control } = useForm({
        defaultValues: defaultRegisterValue,
    });
    const navigate = useNavigate();

    /**
     * Function Definition
     */

    const handleSubmitRegister: SubmitHandler<IRegisterData> = (data) => {
        register({
            data: {
                body: data,
            },
            errorCallbackAction: (err: any) => {
                alertSetMessageSubscription(
                    err.response?.data?.message,
                    "error",
                );
            },
            successCallbackAction: (data: any) => {
                alertSetMessageSubscription(data, "success");
                navigate("/auth/login");
            },
        });
    };

    /**
     * Render
     */
    return (
        <Box
            sx={{
                width: "500px",
                backgroundColor: "white",
                borderRadius: 3,
                padding: 3,
            }}
        >
            <Text variant="h4" title="Sign In With" />
            <Stack spacing={2} mt={3}>
                <Button
                    icon={<GoogleIcon width={30} height={30} />}
                    name={SIGN_UP_WITH_GOOGLE}
                />
                <Button
                    icon={<GithubIcon width={30} height={30} />}
                    name={SIGN_UP_WITH_GOOGLE}
                />
            </Stack>
            <Text title="OR" sx={{ textAlign: "center" }} my={3} />
            <form onSubmit={handleSubmit(handleSubmitRegister)}>
                <Stack spacing={2} mb={4}>
                    <FormTextField
                        name="email"
                        control={control}
                        label="Email"
                        type="email"
                        required
                    />
                    <FormTextField
                        name="password"
                        control={control}
                        label="Password"
                        type="password"
                        required
                    />
                </Stack>
                <Button type="submit" name={SIGN_UP} sx={{ width: "100%" }} />
            </form>
        </Box>
    );
}
