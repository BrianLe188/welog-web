import { GithubIcon, GoogleIcon } from "@/assets/icons";
import Button from "@/share/components/Button";
import FormTextField from "@/share/components/FormTextField";
import Text from "@/share/components/Text";
import { Box, Stack } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { login } from "../services/AuthService";
import { onSetMessageSubscription, useAlert } from "@/zustand/useAlert";
import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_WITH_GITHUB,
    LOGIN_WITH_GOOGLE,
} from "@/share/constants/message";
import { setItem } from "@/share/common/localstorage";

const defaultRegisterValue = {
    email: "",
    password: "",
};

interface ILoginData {
    email: string;
    password: string;
}

export default function LoginPage() {
    /**
     * Subscriptions
     */
    const alertSetMessageSubscription = useAlert(onSetMessageSubscription);

    const { handleSubmit, control } = useForm({
        defaultValues: defaultRegisterValue,
    });

    /**
     * Function Definition
     */

    const handleSubmitRegister: SubmitHandler<ILoginData> = async (data) => {
        await login({
            data: {
                query: data,
            },
            errorCallbackAction: (err: any) => {
                alertSetMessageSubscription(
                    err.response?.data?.message,
                    "error",
                );
            },
            successCallbackAction: (data: any) => {
                alertSetMessageSubscription(LOGIN_SUCCESS, "success");
                setItem("accessToken", data?.accessToken);
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
            <Text variant="h4" title="Login With" />
            <Stack spacing={2} mt={3}>
                <Button
                    icon={<GoogleIcon width={30} height={30} />}
                    name={LOGIN_WITH_GOOGLE}
                />
                <Button
                    icon={<GithubIcon width={30} height={30} />}
                    name={LOGIN_WITH_GITHUB}
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
                <Button type="submit" name={LOGIN} sx={{ width: "100%" }} />
            </form>
        </Box>
    );
}
