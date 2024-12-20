import {
  MessageCircleMore,
  Search,
  ShieldCheck,
  ShieldX,
  Skull,
} from "lucide-react";
import { OptionItem } from "./types";

/** Выпадающий список тэгов для фотографий */
export const RoleOptions: OptionItem[] = [
  { id: "guest", title: "Гость" },
  { id: "user", title: "Сотрудник" },
  { id: "admin", title: "Администратор" },
];

/** Log level options */
export const LogItemOptions: OptionItem[] = [
  {
    id: "critical",
    title: "Серьёзный",
    icon: Skull,
  },
  {
    id: "search",
    title: "Поиск",
    icon: Search,
  },
  {
    id: "normal",
    title: "Обычный",
    icon: MessageCircleMore,
  },
];

/** User activity options */
export const ActivityOptions: OptionItem[] = [
  { id: "1", title: "Активен", icon: ShieldCheck },
  { id: "0", title: "Отключен", icon: ShieldX },
];
