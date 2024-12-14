/** User roles */
export const Roles = ["guest", "user", "admin"] as const;

/** User roles */
export type Role = (typeof Roles)[number];

/** Тэги видов поиска (enum) */
export const SearchVariants = [
  "eq",
  "ilike",
  "between",
  "in",
  "notilike",
  //"hasFeature",
  //"hasFeatureWithDesc",
] as const;

/** Тэги видов поиска (string) */
export type SearchVariant = (typeof SearchVariants)[number];

/** Варианты сортировок */
export const SortVariants = ["created_desc", "created_asc"] as const;

/** Варианты сортировок (string) */
export type SortVariant = (typeof SortVariants)[number];

/** Тип для селекта или комбобокса */
export type OptionItem = {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
};

/** Пропсы для вложенных кастомных компонентов формы */
export type DataFieldProps = {
  /** имя из валидатора или react-hook-form */
  name: string;
  /** надпись сверху поля (перед перечислением выпадающего списка) */
  label?: string;
  /** подробное описание, комментарий */
  desc?: string;
  placeholder?: string;
  /** Значения для выпадающего списка */
  options?: OptionItem[];
  //allowEmptyOption?: boolean;
  /** Фильтр поддерживаемых файлов (для FileInput) */
  accept?: string;
  /** inline стили для className */
  styles?: string;
  disabled?: boolean;
  // тип, возможно для автоподбора компонента рендера
  type?: "text" | "date" | "select" | "combobox" | "file" | "password";
  // варианты поиска по указанному полю
  searchVariants?: SearchVariant[];
  // тип компонента при рендера
  searchType?: "text" | "date" | "maskedtextdate" | "select" | "multicombobox";
  // тип компонента при пакетном вводе (по сути - копия type)
  batchType?: "text" | "date" | "select";
  /** Группа/форма/столбец в таблице, где необходимо рендерить поле */
  //tab?: "file" | "protocol" | "personal" | "description";
  /** Маска для соответствующих полей ("9999-99-99" или "+7(999)999-99-99" */
  mask?: string;
  /** Скрыть описание (актуально для страницы поиска) */
  hideDesc?: boolean;
  /** Поле можно экспортировать в Excel */
  exportable?: boolean;
  /** Поле выбрано при экспорте в Excel */
  featuredExportable?: boolean;
  /** Порядок сортировки в выпадающем списке (меньше - выше) */
  sort?: number;
};
