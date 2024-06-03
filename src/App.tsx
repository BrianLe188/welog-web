import ThemeContextProvider from "./contexts/ThemeContext";
import Routers from "./routers";
import Alert from "./share/components/Alert";
import {
    fullInfoSelector,
    onHideSubscription,
    useAlert,
} from "./zustand/useAlert";

function App() {
    const alertFullInfo = useAlert(fullInfoSelector);
    const alertCloseSubscription = useAlert(onHideSubscription);

    const handleCloseAlert = () => {
        alertCloseSubscription();
    };

    return (
        <ThemeContextProvider>
            <Routers />
            <Alert
                message={alertFullInfo.message}
                open={alertFullInfo.show}
                severity={alertFullInfo.severity}
                onClose={handleCloseAlert}
            />
        </ThemeContextProvider>
    );
}

export default App;
