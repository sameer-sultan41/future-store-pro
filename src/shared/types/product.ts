

export type TUserReview = {
  userName: string;
  userImage: string;
  isVerified: boolean;
  date: Date;
  likeNumber: number;
  dislikeNumber: number;
  text: string;
  advantages?: string[];
  disAdvantages?: string[];
};

export type TProductSpec = {
  groupName: string;
  specs: {
    label: string;
    data: string[];
  }[];
};

export type TProductOption = {
  optionName: string;
  options: { value: string; label?: string }[];
  optionSelectedId: number;
  type: "text" | "color";
};

export type TProductBoard = {
  id: string;
  name: string;
  isAvailable: boolean;
  shortDesc: string;
  imgUrl: string;
  price: number;
  dealDate?: Date;
  dealPrice?: number;
  specialFeatures?: string[];
  options?: TProductOption[];
  defaultQuantity: number;
};

export type TProductPath = {
  label: string;
  url: string;
};

export type TProduct = {
  path: TProductPath[];
  board: TProductBoard;
  gallery: string[];
  specification: TProductSpec[];
  reviews: TUserReview[];
};

export type TAddProductFormValues = {
  name: string;
  isAvailable: boolean;
  specialFeatures: string[];
  brandID: string;
  desc?: string;
  price: string;
  salePrice?: string;
  images: string[];
  categoryID: string;
  specifications: any[];
};

export type TProductListItem = {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
};
export type TCartListItemDB = {
  id: string;
  name: string;
  images: string[];
  price: number;
  salePrice: number | null;
  url?: string;
};

export type TUpcomingProduct = {
  id: string;
  product_id: string;
  launch_date: string;
  is_notifiable: boolean;
  notification_sent: boolean;
  created_at: string;
  products: {
    id: string;
    sku: string;
    url: string;
    images: string[];
    category_id: string;
    categories: {
      id: string;
      url: string;
    } | null;
    product_translations: {
      language_code: string;
      name: string;
      description: string;
      short_description: string;
    }[];
  };
};

export type TSpecification = {
  groupName: string;
  specs: {
    name: string;
    value: string;
  }[];
};
// build success
export type TPath = {
  id: string;
  parentID: string | null;
  name: string;
  url: string;
};

export type TProductPageInfo = {
  id: string;
  name: string;
  isAvailable: boolean;
  desc: string | null;
  images: string[];
  optionSets: string[];
  specialFeatures: string[];
  price: number;
  salePrice: number | null;
  specifications: TSpecification[];
  path: TPath[];
};
