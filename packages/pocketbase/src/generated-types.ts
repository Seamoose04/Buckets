/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export const Collections = {
	Authorigins: "_authOrigins",
	Externalauths: "_externalAuths",
	Mfas: "_mfas",
	Otps: "_otps",
	Superusers: "_superusers",
	AccountabilityPartners: "accountability_partners",
	Accounts: "accounts",
	Buckets: "buckets",
	BudgetCycles: "budget_cycles",
	Glasses: "glasses",
	Income: "income",
	RolloverAllocations: "rollover_allocations",
	SavingsGoals: "savings_goals",
	SubPurchases: "sub_purchases",
	Transactions: "transactions",
	Transfers: "transfers",
	Users: "users",
} as const
export type Collections = typeof Collections[keyof typeof Collections]

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type AccountabilityPartnersRecord = {
	active?: boolean
	id: string
	imessage_handle: string
	name: string
}

export const AccountsAccountTypeOptions = {
	"checkings": "checkings",
	"savings": "savings",
} as const
export type AccountsAccountTypeOptions = typeof AccountsAccountTypeOptions[keyof typeof AccountsAccountTypeOptions]
export type AccountsRecord = {
	account_type: AccountsAccountTypeOptions
	id: string
	institution_name: string
	plaid_access_token: string
	plaid_account_id: string
	plaid_item_id: string
}

export type BucketsRecord = {
	color: string
	id: string
	name: string
}

export const BudgetCyclesStatusOptions = {
	"active": "active",
	"closed": "closed",
} as const
export type BudgetCyclesStatusOptions = typeof BudgetCyclesStatusOptions[keyof typeof BudgetCyclesStatusOptions]
export type BudgetCyclesRecord = {
	end_date: IsoDateString
	id: string
	rollover_amount?: number
	start_date: IsoDateString
	status: BudgetCyclesStatusOptions
}

export type GlassesRecord = {
	allocation: number
	archived?: boolean
	bucket: RecordIdString
	guideline_percent: number
	id: string
	name: string
}

export const IncomeTypeOptions = {
	"base": "base",
	"bonus": "bonus",
} as const
export type IncomeTypeOptions = typeof IncomeTypeOptions[keyof typeof IncomeTypeOptions]
export type IncomeRecord = {
	amount: number
	amount_allocated?: number
	date?: IsoDateString
	id: string
	source?: string
	type: IncomeTypeOptions
}

export type RolloverAllocationsRecord = {
	amount: number
	budget_cycle: RecordIdString
	id: string
	savings_goal: RecordIdString
}

export type SavingsGoalsRecord = {
	archived?: boolean
	current_amount: number
	deadline?: IsoDateString
	id: string
	name: string
	target_amount?: number
}

export type SubPurchasesRecord = {
	amount: number
	glass: RecordIdString
	id: string
	note?: string
	transaction: RecordIdString
}

export const TransactionsSubscriptionSourceOptions = {
	"auto": "auto",
	"manual": "manual",
	"none": "none",
} as const
export type TransactionsSubscriptionSourceOptions = typeof TransactionsSubscriptionSourceOptions[keyof typeof TransactionsSubscriptionSourceOptions]
export type TransactionsRecord = {
	account: RecordIdString
	amount: number
	date: IsoDateString
	id: string
	is_subscription?: boolean
	merchant: string
	needs_split?: boolean
	plaid_category: string
	plaid_transaction_id: string
	subscription_source?: TransactionsSubscriptionSourceOptions
}

export const TransfersScopeOptions = {
	"same_bucket": "same_bucket",
	"cross_bucket": "cross_bucket",
} as const
export type TransfersScopeOptions = typeof TransfersScopeOptions[keyof typeof TransfersScopeOptions]

export const TransfersDirectionOptions = {
	"need_to_want": "need_to_want",
	"want_to_need": "want_to_need",
} as const
export type TransfersDirectionOptions = typeof TransfersDirectionOptions[keyof typeof TransfersDirectionOptions]
export type TransfersRecord = {
	accountability_partner_notified?: RecordIdString
	amount: number
	date: IsoAutoDateString
	direction: TransfersDirectionOptions
	from: RecordIdString
	id: string
	reason?: string
	scope: TransfersScopeOptions
	to: RecordIdString
}

export type UsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AccountabilityPartnersResponse<Texpand = unknown> = Required<AccountabilityPartnersRecord> & BaseSystemFields<Texpand>
export type AccountsResponse<Texpand = unknown> = Required<AccountsRecord> & BaseSystemFields<Texpand>
export type BucketsResponse<Texpand = unknown> = Required<BucketsRecord> & BaseSystemFields<Texpand>
export type BudgetCyclesResponse<Texpand = unknown> = Required<BudgetCyclesRecord> & BaseSystemFields<Texpand>
export type GlassesResponse<Texpand = unknown> = Required<GlassesRecord> & BaseSystemFields<Texpand>
export type IncomeResponse<Texpand = unknown> = Required<IncomeRecord> & BaseSystemFields<Texpand>
export type RolloverAllocationsResponse<Texpand = unknown> = Required<RolloverAllocationsRecord> & BaseSystemFields<Texpand>
export type SavingsGoalsResponse<Texpand = unknown> = Required<SavingsGoalsRecord> & BaseSystemFields<Texpand>
export type SubPurchasesResponse<Texpand = unknown> = Required<SubPurchasesRecord> & BaseSystemFields<Texpand>
export type TransactionsResponse<Texpand = unknown> = Required<TransactionsRecord> & BaseSystemFields<Texpand>
export type TransfersResponse<Texpand = unknown> = Required<TransfersRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	accountability_partners: AccountabilityPartnersRecord
	accounts: AccountsRecord
	buckets: BucketsRecord
	budget_cycles: BudgetCyclesRecord
	glasses: GlassesRecord
	income: IncomeRecord
	rollover_allocations: RolloverAllocationsRecord
	savings_goals: SavingsGoalsRecord
	sub_purchases: SubPurchasesRecord
	transactions: TransactionsRecord
	transfers: TransfersRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	accountability_partners: AccountabilityPartnersResponse
	accounts: AccountsResponse
	buckets: BucketsResponse
	budget_cycles: BudgetCyclesResponse
	glasses: GlassesResponse
	income: IncomeResponse
	rollover_allocations: RolloverAllocationsResponse
	savings_goals: SavingsGoalsResponse
	sub_purchases: SubPurchasesResponse
	transactions: TransactionsResponse
	transfers: TransfersResponse
	users: UsersResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
