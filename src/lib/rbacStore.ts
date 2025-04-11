export interface Feature {
    id: string;
    name: string;
    category: string;
  }
  
  export const featuresMap: Record<string, Feature[]> = {
    admin: [
      { id: "upload_contact_csv", name: "Upload Contacts CSV", category: "Contacts" },
      { id: "view_contacts", name: "View Contacts", category: "Contacts" },
      { id: "edit_contacts", name: "Edit Contacts", category: "Contacts" },
      { id: "manage_campaigns", name: "Manage Campaigns", category: "Campaigns" },
      { id: "view_dashboard", name: "View Dashboard", category: "Dashboard" },
      { id: "create_user", name: "Create User", category: "User Management" },
      { id: "delete_user", name: "Delete User", category: "User Management" },
      { id: "view_reports", name: "View Reports", category: "Reports" },
      { id: "generate_invoice", name: "Generate Invoice", category: "Billing" },
      { id: "manage_roles", name: "Manage Roles", category: "Permissions" },
      { id: "view_transactions", name: "View Transactions", category: "Billing" },
    ],
    sales_rep: [
      { id: "view_contacts", name: "View Contacts", category: "Contacts" },
      { id: "edit_contact_info", name: "Edit Contact Info", category: "Contacts" },
      { id: "manage_campaigns", name: "Manage Campaigns", category: "Campaigns" },
      { id: "view_dashboard", name: "View Dashboard", category: "Dashboard" },
      { id: "generate_reports", name: "Generate Reports", category: "Reports" },
    ],
    marketing_manager: [
      { id: "view_campaigns", name: "View Campaigns", category: "Campaigns" },
      { id: "create_campaign", name: "Create Campaign", category: "Campaigns" },
      { id: "view_reports", name: "View Reports", category: "Reports" },
      { id: "edit_campaign", name: "Edit Campaign", category: "Campaigns" },
      { id: "view_dashboard", name: "View Dashboard", category: "Dashboard" },
    ],
    billing_manager: [
      { id: "view_transactions", name: "View Transactions", category: "Billing" },
      { id: "manage_billing", name: "Manage Billing", category: "Billing" },
      { id: "generate_invoice", name: "Generate Invoice", category: "Billing" },
      { id: "view_reports", name: "View Reports", category: "Reports" },
    ],
    hr_manager: [
      { id: "view_employees", name: "View Employees", category: "HR" },
      { id: "edit_employee_info", name: "Edit Employee Info", category: "HR" },
      { id: "create_employee", name: "Create Employee", category: "HR" },
      { id: "delete_employee", name: "Delete Employee", category: "HR" },
    ],
    product_manager: [
      { id: "view_product_info", name: "View Product Info", category: "Product Management" },
      { id: "edit_product_info", name: "Edit Product Info", category: "Product Management" },
      { id: "create_product", name: "Create Product", category: "Product Management" },
      { id: "delete_product", name: "Delete Product", category: "Product Management" },
    ],
    customer_support: [
      { id: "view_tickets", name: "View Tickets", category: "Support" },
      { id: "resolve_tickets", name: "Resolve Tickets", category: "Support" },
      { id: "create_tickets", name: "Create Tickets", category: "Support" },
    ],
  };
  
  export interface Role {
  id: string;
  name: string;
}

export const allRoles: Role[] = [
  { id: "admin", name: "Administrator" },
  { id: "sales_rep", name: "Sales Representative" },
  { id: "marketing_manager", name: "Marketing Manager" },
  { id: "billing_manager", name: "Billing Manager" },
  { id: "hr_manager", name: "HR Manager" },
  { id: "product_manager", name: "Product Manager" },
  { id: "customer_support", name: "Customer Support" }
];
  