import { GraphLayout } from "@/layouts/graphs/GraphLayout";
import { useTranslations } from "@/hooks/use-translations";
import { PageProps } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

interface GraphProps extends PageProps {
  topBooks: {
    title: string;
    value: number;
    isbn: string;
    author: string;
    genres: string;
    publisher: string;
  }[];
  topUsers: {
    name: string;
    value: number;
    loans: number;
    reservations: number;
  }[];
  topZones: {
    zone: string;
    value: number;
    loans: number;
    reservations: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    console.log(payload[0]);
    const data = payload[0].payload;

    return (
      <div className="p-4 bg-white border border-gray-200 rounded-md shadow-lg text-sm text-gray-800">
        <p className="font-semibold text-base">{label}</p>
        {data.title && <p>{data.title}</p>}
        {data.isbn && <p>ISBN: {data.isbn}</p>}
        {data.author && <p>Autor: {data.author}</p>}
        {data.publisher && <p>Editorial: {data.publisher}</p>}
        {data.genres && data.genres && <p>Géneros: {data.genres}</p>}
        {data.loans !== undefined && <p>Préstamos: {data.loans}</p>}
        {data.reservations !== undefined && <p>Reservas: {data.reservations}</p>}
        <p className="font-semibold mt-1">Total: {data.value}</p>
      </div>
    );
  }

  return null;
};

export default function GraphIndex({ topBooks, topUsers, topZones }: GraphProps) {
  const { t } = useTranslations();

  const bookData = topBooks.map((book, index) => ({
    name: `Top ${index + 1}`,
    title: book.title,
    loans: book.value,
    reservations: 0,
    isbn: book.isbn,
    author: book.author,
    genres: book.genres,
    publisher: book.publisher,
  }));

  const userData = topUsers.map((user, index) => ({
    name: `Top ${index + 1}`,
    title: user.name,
    value: user.value,
    loans: user.loans,
    reservations: user.reservations,
  }));

  const zoneData = topZones.map((zone, index) => ({
    name: `Top ${index + 1}`,
    title: zone.zone,
    value: zone.value,
    loans: zone.loans,
    reservations: zone.reservations,
  }));

  const renderChart = (data: any[], title: string, color1: string, color2: string) => (
    <div className="w-full max-w-5xl bg-primary p-6 rounded-2xl shadow-md">
      <h3 className="text-2xl font-bold text-secondary mb-6">{title}</h3>
      <div className="min-w-[700px] h-[400px] ">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} interval={0} />
            <YAxis tick={{ fill: "#ccg" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
            <Bar dataKey="loans" stackId="a" fill={color1} barSize={40} name="Préstamos" />
            <Bar dataKey="reservations" stackId="a" fill={color2} barSize={40} name="Reservas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const [selectedGraph, setSelectedGraph] = React.useState("books");

  const handleSelectChange = (value: string) => {
    setSelectedGraph(value);
  };

  return (
    <GraphLayout title={t("ui.graph.title")}>
      {/* @TODO
            Padding que falla */}
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-3xl font-bold text-primary mb-6 ">
          {t("ui.graph.stadistics_title")}
        </h2>
        <Select value={selectedGraph} onValueChange={handleSelectChange} >
          <SelectTrigger className="bg-muted w-full max-w-[400px] mb-9">
            <SelectValue placeholder={t("ui.graph.select_graph")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="books">{t("ui.graph.top_books")}</SelectItem>
              <SelectItem value="users">{t("ui.graph.top_users")}</SelectItem>
              <SelectItem value="zones">{t("ui.graph.top_zones")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {selectedGraph === "books" && renderChart(bookData, t("ui.graph.top_books"), "#4CAF50", "#9C27B0")}
        {selectedGraph === "users" && renderChart(userData, t("ui.graph.top_users"), "#4CAF50", "#9C27B0")}
        {selectedGraph === "zones" && renderChart(zoneData, t("ui.graph.top_zones"), "#4CAF50", "#9C27B0")}
        </div>
     
    </GraphLayout>
  );
}
