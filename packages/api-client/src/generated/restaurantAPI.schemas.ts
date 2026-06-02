// ⚠️  AUTO-GENERATED — DO NOT EDIT MANUALLY
// Re-generate with: pnpm gen:contract (from repo root)
// Source: services/backend /openapi.json → Orval
// @see packages/api-client/orval.config.ts
export type ListMenuCategoriesParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
};

export type ListMenuCategories200Item = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  name: string;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  position: number;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

export type CreateMenuCategoryBody = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /** @minLength 1 */
  name: string;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  position?: number;
};

export type CreateMenuCategory201 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  name: string;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  position: number;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

/**
 * @nullable
 */
export type CreateMenuCategory400DetailsItem = unknown | null;

export type CreateMenuCategory400 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: CreateMenuCategory400DetailsItem[];
};

export type UpdateMenuCategoryParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
};

export type UpdateMenuCategoryBody = {
  /** @minLength 1 */
  name?: string;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  position?: number;
};

export type UpdateMenuCategory200 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  name: string;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  position: number;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

/**
 * @nullable
 */
export type UpdateMenuCategory404DetailsItem = unknown | null;

export type UpdateMenuCategory404 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: UpdateMenuCategory404DetailsItem[];
};

export type ListMenuItemsParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
/**
 * @minimum 0
 * @exclusiveMinimum
 */
categoryId?: number;
available?: ListMenuItemsAvailable;
};

export type ListMenuItemsAvailable = typeof ListMenuItemsAvailable[keyof typeof ListMenuItemsAvailable];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListMenuItemsAvailable = {
  true: 'true',
  false: 'false',
} as const;

export type ListMenuItems200Item = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  categoryId: number;
  name: string;
  /** @nullable */
  description: string | null;
  /**
   * @minimum 0
   * @nullable
   */
  price: number | null;
  available: boolean;
  /** @nullable */
  imageUrl: string | null;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

export type CreateMenuItemBodyPrice = number | string;

export type CreateMenuItemBody = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  categoryId: number;
  /** @minLength 1 */
  name: string;
  /** @nullable */
  description?: string | null;
  price: CreateMenuItemBodyPrice;
  available?: boolean;
  /** @nullable */
  imageUrl?: string | null;
};

export type CreateMenuItem201 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  categoryId: number;
  name: string;
  /** @nullable */
  description: string | null;
  /**
   * @minimum 0
   * @nullable
   */
  price: number | null;
  available: boolean;
  /** @nullable */
  imageUrl: string | null;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

/**
 * @nullable
 */
export type CreateMenuItem400DetailsItem = unknown | null;

export type CreateMenuItem400 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: CreateMenuItem400DetailsItem[];
};

export type UpdateMenuItemParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
};

export type UpdateMenuItemBodyPrice = number | string;

export type UpdateMenuItemBody = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  categoryId?: number;
  /** @minLength 1 */
  name?: string;
  /** @nullable */
  description?: string | null;
  price?: UpdateMenuItemBodyPrice;
  available?: boolean;
  /** @nullable */
  imageUrl?: string | null;
};

export type UpdateMenuItem200 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  categoryId: number;
  name: string;
  /** @nullable */
  description: string | null;
  /**
   * @minimum 0
   * @nullable
   */
  price: number | null;
  available: boolean;
  /** @nullable */
  imageUrl: string | null;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

/**
 * @nullable
 */
export type UpdateMenuItem404DetailsItem = unknown | null;

export type UpdateMenuItem404 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: UpdateMenuItem404DetailsItem[];
};

export type ListOrdersParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
status?: ListOrdersStatus;
/**
 * @minimum 0
 * @exclusiveMinimum
 */
customerId?: number;
};

export type ListOrdersStatus = typeof ListOrdersStatus[keyof typeof ListOrdersStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListOrdersStatus = {
  pending: 'pending',
  accepted: 'accepted',
  preparing: 'preparing',
  ready: 'ready',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

export type ListOrders200ItemStatus = typeof ListOrders200ItemStatus[keyof typeof ListOrders200ItemStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ListOrders200ItemStatus = {
  pending: 'pending',
  accepted: 'accepted',
  preparing: 'preparing',
  ready: 'ready',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

export type ListOrders200Item = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   * @nullable
   */
  customerId: number | null;
  status: ListOrders200ItemStatus;
  /**
   * @minimum 0
   * @nullable
   */
  totalAmount: number | null;
  /** @nullable */
  notes: string | null;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

export type CreateOrderBodyItemsItem = {
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  menuItemId: number;
  /**
   * @minimum 1
   * @maximum 99
   */
  quantity: number;
  /** @maxLength 500 */
  specialInstructions?: string;
};

export type CreateOrderBody = {
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  restaurantId: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  customerId?: number;
  /** @maxLength 1000 */
  notes?: string;
  /** @minItems 1 */
  items: CreateOrderBodyItemsItem[];
};

export type CreateOrder201Status = typeof CreateOrder201Status[keyof typeof CreateOrder201Status];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateOrder201Status = {
  pending: 'pending',
  accepted: 'accepted',
  preparing: 'preparing',
  ready: 'ready',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

/**
 * @nullable
 */
export type CreateOrder201ItemsItemMenuItem = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  name: string;
  /** @nullable */
  imageUrl: string | null;
} | null;

export type CreateOrder201ItemsItem = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  orderId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  menuItemId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  quantity: number;
  /**
   * @minimum 0
   * @nullable
   */
  unitPrice: number | null;
  /**
   * @minimum 0
   * @nullable
   */
  subtotal: number | null;
  /** @nullable */
  specialInstructions: string | null;
  /** @nullable */
  menuItem?: CreateOrder201ItemsItemMenuItem;
};

/**
 * @nullable
 */
export type CreateOrder201Customer = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  name: string;
  email: string;
  /** @nullable */
  phone: string | null;
} | null;

export type CreateOrder201 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   * @nullable
   */
  customerId: number | null;
  status: CreateOrder201Status;
  /**
   * @minimum 0
   * @nullable
   */
  totalAmount: number | null;
  /** @nullable */
  notes: string | null;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
  items: CreateOrder201ItemsItem[];
  /** @nullable */
  customer?: CreateOrder201Customer;
};

/**
 * @nullable
 */
export type CreateOrder400DetailsItem = unknown | null;

export type CreateOrder400 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: CreateOrder400DetailsItem[];
};

/**
 * @nullable
 */
export type CreateOrder404DetailsItem = unknown | null;

export type CreateOrder404 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: CreateOrder404DetailsItem[];
};

/**
 * @nullable
 */
export type CreateOrder409DetailsItem = unknown | null;

export type CreateOrder409 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: CreateOrder409DetailsItem[];
};

/**
 * @nullable
 */
export type CreateOrder422DetailsItem = unknown | null;

export type CreateOrder422 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: CreateOrder422DetailsItem[];
};

export type GetOrderParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
};

export type GetOrder200Status = typeof GetOrder200Status[keyof typeof GetOrder200Status];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetOrder200Status = {
  pending: 'pending',
  accepted: 'accepted',
  preparing: 'preparing',
  ready: 'ready',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

/**
 * @nullable
 */
export type GetOrder200ItemsItemMenuItem = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  name: string;
  /** @nullable */
  imageUrl: string | null;
} | null;

export type GetOrder200ItemsItem = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  orderId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  menuItemId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  quantity: number;
  /**
   * @minimum 0
   * @nullable
   */
  unitPrice: number | null;
  /**
   * @minimum 0
   * @nullable
   */
  subtotal: number | null;
  /** @nullable */
  specialInstructions: string | null;
  /** @nullable */
  menuItem?: GetOrder200ItemsItemMenuItem;
};

/**
 * @nullable
 */
export type GetOrder200Customer = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  name: string;
  email: string;
  /** @nullable */
  phone: string | null;
} | null;

export type GetOrder200 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   * @nullable
   */
  customerId: number | null;
  status: GetOrder200Status;
  /**
   * @minimum 0
   * @nullable
   */
  totalAmount: number | null;
  /** @nullable */
  notes: string | null;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
  items: GetOrder200ItemsItem[];
  /** @nullable */
  customer?: GetOrder200Customer;
};

/**
 * @nullable
 */
export type GetOrder404DetailsItem = unknown | null;

export type GetOrder404 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: GetOrder404DetailsItem[];
};

export type ApplyOrderActionParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
};

export type ApplyOrderActionBodyAction = typeof ApplyOrderActionBodyAction[keyof typeof ApplyOrderActionBodyAction];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ApplyOrderActionBodyAction = {
  accept: 'accept',
  start_preparing: 'start_preparing',
  mark_ready: 'mark_ready',
  complete: 'complete',
  cancel: 'cancel',
} as const;

export type ApplyOrderActionBody = {
  action: ApplyOrderActionBodyAction;
};

export type ApplyOrderAction200Status = typeof ApplyOrderAction200Status[keyof typeof ApplyOrderAction200Status];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ApplyOrderAction200Status = {
  pending: 'pending',
  accepted: 'accepted',
  preparing: 'preparing',
  ready: 'ready',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

export type ApplyOrderAction200 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   * @nullable
   */
  customerId: number | null;
  status: ApplyOrderAction200Status;
  /**
   * @minimum 0
   * @nullable
   */
  totalAmount: number | null;
  /** @nullable */
  notes: string | null;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

/**
 * @nullable
 */
export type ApplyOrderAction404DetailsItem = unknown | null;

export type ApplyOrderAction404 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: ApplyOrderAction404DetailsItem[];
};

/**
 * @nullable
 */
export type ApplyOrderAction422DetailsItem = unknown | null;

export type ApplyOrderAction422 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: ApplyOrderAction422DetailsItem[];
};

export type ListCustomersParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
};

export type ListCustomers200Item = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  name: string;
  email: string;
  /** @nullable */
  phone: string | null;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  loyaltyPoints: number;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
  /** @minimum 0 */
  orderCount: number;
  /** @minimum 0 */
  totalSpend: number;
};

export type CreateCustomerBody = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  /** @minLength 1 */
  name: string;
  email: string;
  /** @nullable */
  phone?: string | null;
};

export type CreateCustomer201 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  name: string;
  email: string;
  /** @nullable */
  phone: string | null;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  loyaltyPoints: number;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

/**
 * @nullable
 */
export type CreateCustomer400DetailsItem = unknown | null;

export type CreateCustomer400 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: CreateCustomer400DetailsItem[];
};

export type GetCustomerParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
};

export type GetCustomer200 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  name: string;
  email: string;
  /** @nullable */
  phone: string | null;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  loyaltyPoints: number;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
  /** @minimum 0 */
  orderCount: number;
  /** @minimum 0 */
  totalSpend: number;
};

/**
 * @nullable
 */
export type GetCustomer404DetailsItem = unknown | null;

export type GetCustomer404 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: GetCustomer404DetailsItem[];
};

export type UpdateCustomerParams = {
/**
 * @minimum 0
 * @exclusiveMinimum
 */
restaurantId: number;
};

export type UpdateCustomerBody = {
  /** @minLength 1 */
  name?: string;
  email?: string;
  /** @nullable */
  phone?: string | null;
};

export type UpdateCustomer200 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  name: string;
  email: string;
  /** @nullable */
  phone: string | null;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  loyaltyPoints: number;
  /** @nullable */
  createdAt: string | null;
  /** @nullable */
  updatedAt: string | null;
};

/**
 * @nullable
 */
export type UpdateCustomer404DetailsItem = unknown | null;

export type UpdateCustomer404 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: UpdateCustomer404DetailsItem[];
};

export type GetSettings200ServiceAvailability = typeof GetSettings200ServiceAvailability[keyof typeof GetSettings200ServiceAvailability];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSettings200ServiceAvailability = {
  dine_in: 'dine_in',
  takeaway: 'takeaway',
  delivery: 'delivery',
  all: 'all',
} as const;

export type GetSettings200 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  orderingEnabled: boolean;
  autoAccept: boolean;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  defaultPrepTimeMinutes: number;
  /**
   * @minimum 0
   * @nullable
   */
  minimumOrderAmount: number | null;
  serviceAvailability: GetSettings200ServiceAvailability;
  /** @nullable */
  openingHoursNotes: string | null;
  /** @nullable */
  updatedAt: string | null;
};

/**
 * @nullable
 */
export type GetSettings404DetailsItem = unknown | null;

export type GetSettings404 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: GetSettings404DetailsItem[];
};

export type UpdateSettingsBodyMinimumOrderAmount = number | string;

export type UpdateSettingsBodyServiceAvailability = typeof UpdateSettingsBodyServiceAvailability[keyof typeof UpdateSettingsBodyServiceAvailability];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateSettingsBodyServiceAvailability = {
  dine_in: 'dine_in',
  takeaway: 'takeaway',
  delivery: 'delivery',
  all: 'all',
} as const;

export type UpdateSettingsBody = {
  orderingEnabled?: boolean;
  autoAccept?: boolean;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  defaultPrepTimeMinutes?: number;
  minimumOrderAmount?: UpdateSettingsBodyMinimumOrderAmount;
  serviceAvailability?: UpdateSettingsBodyServiceAvailability;
  /** @nullable */
  openingHoursNotes?: string | null;
};

export type UpdateSettings200ServiceAvailability = typeof UpdateSettings200ServiceAvailability[keyof typeof UpdateSettings200ServiceAvailability];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateSettings200ServiceAvailability = {
  dine_in: 'dine_in',
  takeaway: 'takeaway',
  delivery: 'delivery',
  all: 'all',
} as const;

export type UpdateSettings200 = {
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  id: number;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  restaurantId: number;
  orderingEnabled: boolean;
  autoAccept: boolean;
  /**
   * @minimum -2147483648
   * @maximum 2147483647
   */
  defaultPrepTimeMinutes: number;
  /**
   * @minimum 0
   * @nullable
   */
  minimumOrderAmount: number | null;
  serviceAvailability: UpdateSettings200ServiceAvailability;
  /** @nullable */
  openingHoursNotes: string | null;
  /** @nullable */
  updatedAt: string | null;
};

/**
 * @nullable
 */
export type UpdateSettings404DetailsItem = unknown | null;

export type UpdateSettings404 = {
  error: string;
  /** Zod validation issues (present only on 400 responses) */
  details?: UpdateSettings404DetailsItem[];
};

export type GetStats200TopItemsItem = {
  menuItemId: number;
  name: string;
  totalOrdered: number;
};

export type GetStats200 = {
  totalOrders: number;
  pendingOrders: number;
  /** @minimum 0 */
  revenue: number;
  topItems: GetStats200TopItemsItem[];
};

