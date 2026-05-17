export interface DataList {
    id: number;
    title: string;
    level: "easy" | "medium" | "hard";
    desc: string;
}

export type FilteredType = "all" | "easy" | "medium" | "hard";