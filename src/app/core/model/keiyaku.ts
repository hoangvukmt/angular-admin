export class KeiyakuDetail {
    keiyaku_no: number;
    group_id: number;
    family_no: number;
    family_name: string;
    hiho_family_no: number;
    hiho_family_name: string;
    agent_no: number;
    company_cd: string;
    company_name: string;
    tanto_name_company: string;
    phone: string;
    url: string;
    memo: string;
    hosho_category_f: number;
    product_cd: string;
    product_name: string;
    category_cd: string;
    policy_no: string;
    status: number;
    contract_date: string;
    hoken_end_date: string;
    h_kikan_f: number;
    h_kikan: number;
    hoken_p: number;
    haraikata: number;
    p_kikan_f: number;
    p_kikan: number;
    tanto_name_keiyaku: string;
    nyuryoku_f: number;
    file_uploads = [];
    shukeiyaku: ShuKeiyaku[] = [];
    tokuyakus: Tokuyakus[] = [];
    shukeiyaku_delete = [];
    tokuyakus_delete = [];
}

export class ShuKeiyaku {
    ColumnVal = '';
    HoshoName = '';
    HoshoNo = '';
    SelType = 0;
    SeqNo = 0;
    Size = 0;
    TypeF = 0;
}

export class Tokuyakus {
    CategoryCd = '';
    CompanyCd = 0;
    ProductCd = '';
    SeqNo = 0;
    TokuNo = 0;
    TokuyakuName = '';
    tokuyakuHoshos: ShuKeiyaku[] = [];
}

export class TokuyakuHoshos {
    ColumnVal = '';
    CreateDate = '';
    HoshoName = '';
    HoshoNo = '';
    KeiyakuHoshoNo = '';
    KeiyakuNo = '';
    KeiyakuTokuyakuNo = '';
    SelType = 0;
    SeqNo = 0;
    Size = 0;
    TypeF = 0;
    UpdateDate = '';
}

export class ColumnKeiyaku {
    AgentName: any;
    CompanyName: any;
    ProductName: any;
    PolicyNo: any;
    StatusName: any;
    FamilyName: any;
    HihoFamilyName: any;
    ContractDate: any;
    HokenEndDate: any;
    HKikanName: any;
    HokenP: any;
    HaraikataName: any;
    PKikanName: any;
}

export class Agent {
    user_no: string;
    agent_name: string;
    tanto_name: string;
    phone: string;
    keiyaku_page: string;
}
