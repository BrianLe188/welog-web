import {
    AssignmentOutlined,
    EmailOutlined,
    ViewSidebarOutlined,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import Text from "./Text";

const menus = [
    {
        id: v4(),
        name: "General",
        children: [
            {
                id: v4(),
                name: "Todo",
                key: "todo",
                icon: <AssignmentOutlined />,
            },
            {
                id: v4(),
                name: "Inbox",
                key: "inbox",
                icon: <EmailOutlined />,
            },
        ],
    },
];

export default function Sidebar() {
    const navigate = useNavigate();

    const handleNavigate = (key: string) => {};

    return (
        <Box
            sx={{
                padding: 3,
                minWidth: 300,
                backgroundColor: "#33333308",
            }}
        >
            <UserWorkSpacePaper>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                        <Avatar alt="" src="">
                            A
                        </Avatar>
                        <Box>
                            <Text title="Anh's Space" />
                        </Box>
                    </Stack>
                    <IconButton>
                        <ViewSidebarOutlined />
                    </IconButton>
                </Stack>
            </UserWorkSpacePaper>
            <Stack marginTop={2}>
                {menus.map((m) => (
                    <Box key={m?.id}>
                        <Text title={m?.name} />
                        <List sx={{ marginTop: 1 }}>
                            {m.children.map((i) => (
                                <ListItemButton
                                    key={i.id}
                                    sx={{
                                        paddingY: 2,
                                        borderRadius: 15,
                                    }}
                                >
                                    <ListItemIcon>{i.icon}</ListItemIcon>
                                    <ListItemText primary={i.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}

const UserWorkSpacePaper = styled(Paper)(({ theme }) => ({
    padding: 15,
    borderRadius: 15,
}));
