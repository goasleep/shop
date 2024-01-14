export interface IUserProfile {
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    full_name: string;
    id: number;
}

export interface IUserProfileUpdate {
    email?: string;
    full_name?: string;
    password?: string;
    is_active?: boolean;
    is_superuser?: boolean;
}

export interface IUserProfileCreate {
    email: string;
    full_name?: string;
    password?: string;
    is_active?: boolean;
    is_superuser?: boolean;
}

export interface Withdraw {
    id: number | null,
    amount: number | null,
    request_person_id: string | null,
    bank_account: string | null,
    status: string | null,
    handle_person_id: string,
    create_time: Date | null,
    update_time: Date | null
  }

export interface Order {
    id: number | null;
    order_number: string;
    order_status: string;
    order_time: Date | null;
    payment_time: Date | null;
    delivery_time: Date | null;
    confirm_receive_time: Date | null;
    shipping_method: string | null;
    order_type: string | null;
    payment_method: string | null;
    order_description: string | null;
    product_name: string | null;
    product_short_name: string | null;
    product_model: string | null;
    delivery_status: string | null;
    product_quantity: number | null;
    product_id: number | null;
    sku_id: number | null;
    product_code: string | null;
    model_code: string | null;
    actual_delivery_weight: number | null;
    product_category_count: number | null;
    total_product_count: number | null;
    total_product_amount: number | null;
    total_product_points: number | null;
    store_discount_total: number | null;
    total_revenue: number | null;
    total_revenue_after_refund: number | null;
    shipping_fee: number | null;
    presale_first_payment: number | null;
    total_receivable_amount: number | null;
    total_receivable_points: number | null;
    actual_payment_amount: number | null;
    stored_value_deduction_principal: number | null;
    stored_value_deduction_gift: number | null;
    gift_card_deduction: number | null;
    refunded_product_amount: number | null;
    refunded_product_points: number | null;
    refunded_shipping_fee: number | null;
    total_refunded_amount: number | null;
    refunded_stored_value_principal: number | null;
    refunded_stored_value_gift: number | null;
    refunded_gift_card: number | null;
    refund_status: string | null;
    cash_on_delivery_service_fee: number | null;
    supply_service_fee: number | null;
    cps_promotion_fee: number | null;
    new_customer_promotion_fee: number | null;
    settlement_status: string | null;
    settlement_amount: number | null;
    settlement_time: Date | null;
    transaction_fee: number | null;
    recipient_name: string | null;
    recipient_phone: string | null;
    province: string | null;
    city: string | null;
    district: string | null;
    address: string | null;
    sender: string | null;
    logistics_company: string | null;
    logistics_number: string | null;
    order_source: string | null;
    buyer_message: string | null;
    seller_remark: string | null;
    wechat_number: string | null;
    id_card_number: string | null;
    ordering_account: string | null;
    ordering_wechat: string | null;
    member_identity: string | null;
    customer_label: string | null;
    delivery_time_commitment: string | null;
    division_amount: number | null;
    distribution_invitation_reward: number | null;
    distribution_recruitment_reward: number | null;
    refund_division_amount: number | null;
    refund_distribution_invitation_reward: number | null;
    refund_distribution_recruitment_reward: number | null;
    refund_fan_commission: number | null;
    refund_invitation_reward: number | null;
    supply_price: number | null;
    goods_payment: number | null;
    merchant_commission_income: number | null;
    merchant_price_difference_amount: number | null;
    cooperation_supplier_name: string | null;
    cooperation_supplier_phone: string | null;
    shop_role: string | null;
    online_shop_name: string | null;
    chain_store_headquarters_division_amount: number | null;
    chain_store_headquarters_shipping_fee_division_amount: number | null;
    refund_chain_store_headquarters_division_amount: number | null;
    refund_headquarters_shipping_fee_division_amount: number | null;
    product_tax_fee: number | null;
    product_total_taxed_amount: number | null;
    total_import_tax: number | null;
    commission_rate: number | null;
    commission_income: number | null;
    commission_owner_id: string | null;
  }