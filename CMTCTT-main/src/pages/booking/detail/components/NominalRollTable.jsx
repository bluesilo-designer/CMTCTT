import { useMemo } from "react";
import { TableCustom } from "@/components/table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
export function NominalRollTable({ trainees, status }) {
    const columns = useMemo(() => {
        const cols = [
            {
                header: "No",
                accessorFn: (_, i) => i + 1,
                id: "no",
            },
            {
                header: "Rank",
                accessorKey: "rank",
            },
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "Weapon Type",
                accessorKey: "weaponType",
                cell: (info) => info.getValue() ?? "—",
            },
            {
                header: "NRIC",
                accessorKey: "nric",
            },
            {
                header: "Last Updated",
                accessorKey: "lastUpdated",
                cell: () => "—",
            },
            {
                header: "Platoon Number",
                accessorKey: "platoon",
            },
        ];
        if (status !== "Overdue") {
            cols.push({
                header: "Actions",
                id: "action",
                cell: () => (<Button className="p-1.5 w-auto bg-transparent text-gray-400 hover:text-brand-primary hover:bg-red-50">
            <Pencil size={14}/>
          </Button>),
            });
        }
        if (status === "Upcoming") {
            cols.unshift({
                header: () => <Checkbox size={14}/>,
                id: "selection",
                cell: () => <Checkbox size={14}/>,
            });
        }
        return cols;
    }, [status]);
    return <TableCustom data={trainees} columns={columns} autoScrollTable={true}/>;
}
