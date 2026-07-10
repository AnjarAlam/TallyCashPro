import { paths } from "@/routes/path";
import { BarChart, Book, LayoutDashboard, Users } from "lucide-react";

// Define your menu items with their URLs
export const mainNavigationItems = [
    {
        title: "Overview",
        url: paths.dashboard.root,
        icon: LayoutDashboard,
    },
    {
        title: "Businesses",
        url: paths.dashboard.business.root,
        icon: Users,
    },
    // {
    //     title: "Books",
    //     url: paths.dashboard.business.book,
    //     icon: Book,
    // },
    // {
    //     title: "Team",
    //     url: paths.dashboard.team.root,
    //     icon: Users,
    // },
];