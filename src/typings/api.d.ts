// 后端接口返回的数据类型

/** 后端返回的用户权益相关类型 */
declare namespace ApiAuth {
  /** 返回的token和刷新token */
  interface Token {
    token: string;
    mobilePhone: string;
    userName: string;
    roleList?: UserRole[];
  }

  /** 用户信息 */
  interface UserInfo {
    /** 用户手机号 */
    mobilePhone: string;
    /** 用户昵称 */
    userName: string;

    roleList: UserRole[];
  }

  type DictList = Array<{
    dictCode: string;
    dictName: string;
    type: number;
    projectType: string;
  }>;

  type Resource = {
    path: string;
    pid: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
  };

  interface UserRole {
    roleId: string; // 角色Id
    roleName: string; // 角色名称
    roleLevel: number; // 角色级别 0: 总管 1：商户超管 2：项目管理员 3：使用者
    defaultRoleFlag: 0 | 1; //	默认角色标记：0-非默认 1-默认	integer
    projectId: string; //	项目id
  }
}

/** 后端返回的路由相关类型 */
declare namespace ApiRoute {
  /** 后端返回的路由数据类型 */
  interface Route {
    /** 动态路由 */
    routes: AuthRoute.Route[];
    /** 路由首页对应的key */
    home: AuthRoute.AllRouteKey;
  }
}

declare namespace ApiCommon {
  /**
   * 验证状态
   * - 0: 否
   * - 1: 是
   */
  type VerifiedStatus = 0 | 1;

  /**
   * 分页列表
   */
  type PageList<T> = {
    /**
     * 列表数据
     */
    content: T[];
    /**
     * 总数
     */
    totalElements: number;
    /**
     * 每页条数
     */
    size: number;
    /**
     * 当前页码
     */
    current: number;
    /**
     * 总页数
     */
    totalPages: number;

    pageable: {
      pageNumber: number;
      pageSize: number;
    };
  };

  /**
   * 分页列表查询参数
   */
  type PageListParams<T> = Partial<T> & {
    /**
     * 当前页码
     */
    currentPage?: number;
    orderBy?: string;

    /**
     * 每页条数
     */
    pageSize?: number;
    xsc?: 'ASC' | 'DESC';
  };

  /**
   * 列表通用属性
   */
  type ListCommonConf = {
    /**
     * ID
     */
    id: number;
    /**
     * 创建id
     */
    createId?: number;
    /**
     * 创建人
     */
    createBy?: string;
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 更新人
     */
    updateBy?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
  };
}

declare namespace ApiMerchant {
  // 商户类型
  interface MerchantItem {
    address: string; // 商户地址
    contract: string; // 商户联系方式	string
    createdTime: string; //	创建时间	string
    isDefault: 0 | 1; //		是否默认总管代理商,0-否,1-是	integer
    merchantArea: string; //		商户区域	string
    merchantAreaCode: string; //		商户区域编码	string
    merchantCode: string; //		商户编码	string
    merchantLeader: string; //		联系人	string
    merchantName: string; //		商户名称	string
    mobilePhone: string; //		注册手机	string
    projectTotal: number; //	项目数
  }

  type PageQueryParams = ApiCommon.PageListParams<{
    merchantLeader?: string; //	联系人		false
    merchantName?: string; //		商户名称		false
    mobilePhone?: string; //		注册手机
  }>;

  /**
   * 商户分页列表
   */
  type PageMerchant = ApiCommon.PageList<MerchantItem>;

  /**
   * 代理商查询项目列表分页列表查询参数
   */
  type PageQueryProjectListParams = ApiCommon.PageListParams<{
    merchantCode: string;
  }>;

  /**
   * 代理商查询项目列表分页列表返回结果
   */
  type PageProject = ApiCommon.PageList<ApiProject.Project>;

  type CreateMerchantParams = Omit<MerchantItem, 'createdTime' | 'isDefault' | 'projectTotal' | 'merchantCode'>;

  type UpdateMerchantParams = Omit<MerchantItem, 'createdTime' | 'isDefault' | 'projectTotal'>;
}

declare namespace ApiUser {
  // 用户角色类型
  interface UserRole {
    roleId: string;
    roleName: string;
  }

  /**
   * 用户状态
   * - 0: 禁用
   * - 1: 正常
   */
  type SysUserStatus = 0 | 1;

  /**
   * 系统用户
   */
  type SysUser = {
    /**
     * 用户id
     */
    userId: string;
    /**
     * 账号
     */
    userName: string;
    /**
     * 账户类型名称
     */
    accountName: string;
    /**
     * 账户类型
     */
    accountType: string;

    /**
     * 角色名称
     */
    roleName: string;
    /**
     * 角色类型
     */
    roleId: string;

    /**
     * 角色等级 0：总部管理员 1：代理商 2：项目管理员 3：使用者 4： 项目超管 5：租户
     */
    roleLevel: number;

    /**
     * 授权项目数量
     */
    authProjectNum: number;

    /**
     * 状态名称
     */
    statusName: string;
    /**
     * 状态类型
     */
    status: 0 | 1;
    /**
     * 手机号码
     */
    mobilePhone: string;
    /**
     * 创建时间
     */
    createdTime: string;

    /**
     * 用户被分配的项目列表
     */
    projectList: ApiUser.AuthProjectItem[];

    merchantCode: string;
  };

  /**
   * 系统用户分页列表
   */
  type PageSysUser = ApiCommon.PageList<SysUser>;

  interface SysUserVo extends SysUser {
    /**
     * 角色ID
     */
    roleId: string;
    /**
     * 所属角色
     * @description 多个英文逗号分割
     */
    roles: string;
  }

  type SysUserVoRequiredKey = Extract<keyof SysUserVo, 'id' | 'username' | 'password' | 'sex'>;

  type PageSysUserParams = ApiCommon.PageListParams<SysUser & { accountType: string }>;

  type CreateSysUserParams = Partial<SysUser> & {
    /**
     * 角色ID列表
     */
    roleIds?: number[];
  } & Pick<SysUser, SysUserVoRequiredKey>;

  /**
   * 系统角色
   */
  type SysRole = ApiCommon.ListCommonConf & {
    /**
     * 名称
     * @minLength 0
     * @maxLength 30
     */
    name: string;
    /**
     * 别名
     * @minLength 0
     * @maxLength 30
     */
    alias: string;
    /**
     * 备注
     * @minLength 0
     * @maxLength 255
     */
    remark?: string;
    /**
     * 状态
     * - 0: 禁用
     * - 1: 正常
     */
    status?: SysUserStatus;
    /**
     * 排序
     */
    sort: number;
  };

  namespace ApiRegion {
    /** 列表数据 */
    interface ListTreeSysRegion {
      id: string;
      createId: string;
      createBy: string;
      createTime: string;
      pid: string;
      name: string;
      code: string;
      sort: number;
      level: number;
      children: ListTreeSysRegion[];
      parentName?: string;
      updateBy?: string;
      updateTime?: string;
    }
    /** 创建数据 */
    type CreateSysRegion = Pick<ListTreeSysRegion, 'pid' | 'name' | 'code' | 'sort' | 'id' | 'parentName'>;
  }

  // 用户拥有的项目权限节点
  interface AuthProjectItem {
    manageProjectFlag?: boolean; // 总管管理员项目标记，仅总部管理员创建账户时标记 true:置灰或隐藏项目
    merchantCode: string; // 商户编码
    projectId: string; // 项目id
    projectName: string; //	项目名称
    projectChildList: ApiProject.Space[]; // 项目所有节点列表
  }

  type CreateUserParams = {
    mobilePhone: string;
  };

  // 用户权限列表项
  interface UserAuthItem {
    projectId: string; //	项目id	string
    projectName: string; //	项目名称	string
    roleId: string; //	授权角色id	string
    roleName: string; //	授权角色名称
    merchantCode: string;
  }
}

declare namespace ApiDict {
  type DictItemParams = {
    page: number;
    pageSize: number;
    prop: string | null;
    order: string | null;
    data: {
      pid: string;
    };
  };
  interface DictParent {
    /** 编码 */
    code: string;
    /** 字典id */
    id: string;
    /** 字典名称 */
    name: string;
    /** 排序 */
    sort: number;
    /** 备注 */
    remark?: string;
  }
  type DictItem = {
    /** 编码 */
    code: string;
    /** 创建者 */
    createBy: string;
    createId: string;
    /** 创建时间 */
    createTime: string;
    /** 项id */
    id: string;
    /** 项名称 */
    name: string;
    /** 所属字典id */
    pid: string;
    /** 排序 */
    sort: number;
    /** 状态，
     * 1：开启
     * 0：停用
     */
    status: 1 | 0;
    /** 备注 */
    remark?: string;
  };
  type PageDictItem = ApiCommon.PageList<DictItem>;

  interface ListTreeSysRegion {
    id: string;
    createId: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    pid: string;
    name: string;
    code: string;
    sort: number;
    level: number;
    children: Child2[];
  }

  interface Child2 {
    id: string;
    createId: string;
    createBy: string;
    createTime: string;
    pid: string;
    name: string;
    code: string;
    sort: number;
    level: number;
    parentName: string;
    children: Child[];
  }

  interface Child {
    id: string;
    createId: string;
    createBy: string;
    createTime: string;
    pid: string;
    name: string;
    code: string;
    sort: number;
    level: number;
    parentName: string;
    updateBy?: string;
    updateTime?: string;
  }
}

declare namespace ApiApp {
  type App = {
    /** App id */
    id: string;
    /** 名称 */
    name: string;
    /** 标识 */
    identification: string;
    /** 创建人 */
    createBy: string;
    /** 创建人id */
    createId: string;
    /** 名称 */
    createTime: string;
    /** 密钥 */
    secretKey: string;
    /** 排序 */
    sort: number;
    /** 状态 */
    status: 1 | 0;
    /** 修改人 */
    updateBy: string;
    /** 修改时间 */
    updateTime: string;
    /** 授权期限 */
    expire: string;
  };

  interface AppTableColumns extends App {
    /** 序号 */
    index: number;
    /** 表格的key（id） */
    key: string;
  }

  /**
   * 应用分页列表
   */
  type PageApp = ApiCommon.PageList<App>;

  type PageAppParams = ApiCommon.PageListParams<Partial<App>>;
}

declare namespace ApiBoard {
  type MapDataItem = {
    projectArea: string;
    projectAreaTotal: number;
  };

  type Board = {
    projectTotal: number;
    deviceTotal: number;
    onlineDevices: number;
    offlineDevices: number;
    projectAreaList: Array<MapDataItem>;
  };
}

declare namespace ApiProject {
  /** 项目 */
  type Project = {
    projectId: string;
    projectType: string;
    projectName: string;
    projectArea: string;
    projectAreaCode: string;
    projectLeader: string;
    onlineDevices: number;
    offlineDevices: number;
    deviceTotal: number;
    address: string;
    contact: string;
    merchantCode: string;
    merchantName: string;
    projectAdminMobile: string;
  };

  type MemberHandle = {
    userId: string;
    projectSpace: ApiUser.AuthProjectItem; // 项目权限列表
    projectId?: string;
    userName: string;
    mobilePhone: string;
    roleId: string; // 账号类型（角色id）
    roleLevel: number; // 角色等级 0:总部管理员 1：超管 2：项目管理员 3：使用者
  };

  type Member = {
    projectId: string;
    mobilePhone: string;
    roleLevel: number;
    roleLevelName: string;
    userId: string;
    userName: string;
    projectSpace: ApiUser.AuthProjectItem;
  };

  interface AddProjectUserParams {
    projectId: Member['projectId'];
    projectUserList: Array<{
      mobilePhone: Member['mobilePhone'];
      roleLevel: Member['roleLevel'];
    }>;
    projectSpace: ApiUser.AuthProjectItem;
  }

  interface BatchAddProjectUserParams {
    projectId: Member['projectId'];
    projectUserList: Array<{
      mobilePhone: Member['mobilePhone'];
      roleLevel: Member['roleLevel'];
      userId: Member['userId'];
    }>;
    projectSpace: ApiUser.AuthProjectItem;
  }

  interface SelectMemberInfoParams {
    userId?: string;
    projectId?: string;
    roleLevel?: number;
  }

  type UpdateProjectMemberParams = Omit<MemberHandle, 'mobilePhone' | 'roleLevel' | 'userId'> & {
    mobilePhone: null | string;
    roleLevel: null | number;
    userId: null | string;
  };

  type DeleteProjectMemberParams = {
    projectId: Member['projectId'];
    userId: Member['userId'];
  };

  type ProjectForm = {
    projectId: string;
    projectType: string | null;
    projectName: string;
    projectArea: string;
    projectAreaCode: string | null;
    projectLeader: string;
    onlineDevices: number;
    offlineDevices: number;
    deviceTotal: number;
    address: string;
    contact: string;
    merchantCode: string;
    merchantName: string;
    projectAdminMobile: string;
  };

  type updateProjectMerchantForm = {
    newMerchantCode: string;
    oldMerchantCode: string;
    projectId: string;
  };

  type PageProject = ApiCommon.PageList<Project>;

  type PageLock = ApiCommon.PageList<ApiDevice.Lock>;

  type PagePersonal = ApiCommon.PageList<ApiDevice.Personal>;

  type PageLockLog = {
    pageNo: number;
    pageSize: number;
    total: number;
    pages: number;
    list: ApiDevice.LockLog[];
  };

  type PageProjectMember = ApiCommon.PageList<Member>;

  type SelectProjectParams = {
    projectArea?: string;
    projectAreaCode?: string;
    projectName?: string;
    projectType?: string;
    currentPage?: number;
    currentPageActual?: number;
    orderBy?: string;
    pageSize: number;
    xsc?: string;
  };

  type SelectMemberParams = {
    mobilePhone?: string | null;
    projectId?: string;
    roleLevel?: number | null;
    userName?: string | null;
    currentPage?: number;
    currentPageActual?: number;
    orderBy?: string;
    pageSize: number;
    xsc?: string;
  };

  type SelectLockParams = {
    params?: string;
    orderByStr?: 'detail.lock_signal' | 'detail.battery_power';
    projectId?: string;
    pageNo?: number;
    pageSize?: number;
    pages?: number;
    total?: number;
  };

  type SelectLockLogParams = {
    projectId?: string;
    imei?: string;
    pageNo?: number;
    pageSize?: number;
    pages?: number;
    total?: number;
    spaceId?: string;
    userId?: string;
    deviceId?: string;
    list?: string[];
  };

  type SelectPersonalParams = {
    projectId?: string;
    sn?: string;
    params: string;
    currentPage?: number;
    pageSize?: number;
    pages?: number;
    total?: number;
    roleLevel: number;
    roleLevels: [4, 6] | [5];
  };

  type CreateProjectParams = Omit<ProjectForm, 'projectId' | 'onlineDevices' | 'offlineDevices' | 'deviceTotal'>;

  type UpdateProjectParams = Omit<ProjectForm, 'onlineDevices' | 'offlineDevices' | 'deviceTotal'>;

  type DeleteProjectParams = {
    projectId: Project['projectId'];
  };

  /** 空间 */
  type Space = {
    cid: string;
    level: number;
    spaceLevel: number;
    publicSpaceFlag: 0 | 1;
    pid: string;
    spaceId: string;
    spaceName: string;
  };

  type SpaceDetail = {
    cid: string; // 空间子id
    guestsNum: number; // 入住人数
    isLock: number; // 是否锁定，0-否，1-是
    labelIds: string[]; // 标签集合
    pid: string; // 空间父id
    publicSpaceFlag: number; // 公共空间标记
    spaceId: string; // 空间id
    spaceLevel: number; // 空间层级
    spaceName: string; // 空间名称
    deviceList: DeviceList[] | null; // 设备集合
    spaceUserList: SpaceUserList[]; // 空间人员集合
  };

  type DeviceList = {
    deviceId: string; // 设备ID
    deviceName: string; // 设备名称
    deviceType: number; // 设备类型
    onLineStatus: number; // 在线状态（0:离线 1:在线
    pic: string; // 设备图片
    proType: string; // 品类码
    productId: string; // 产品Id
    mzgdPropertyDTOList: MzgdPropertyDTOList; // 属性列表
  };

  type SpaceUserList = {
    endTime: string; // 入住结束时间
    isSync: number; // 是否同步到门锁,0-否，1-是
    mobilePhone: string; // 手机号码
    nickName: string; // 昵称
    startTime: string; // 入住开始时间
    userId: string; // 用户id
  };

  type roomMember = {
    userId: string; // 用户id
    endTime: string; // 入住结束时间
    isSync: number; // 是否同步到门锁,0-否，1-是
    mobilePhone: string; // 手机号码
    nickName: string; // 昵称
    startTime: string; // 入住开始时间
  };

  interface FetchDeviceListBySpaceParams {
    deviceName?: string;
    deviceType?: 1 | 2;
    list?: Array<any>;
    pageNo?: number;
    pageSize: number;
    pages?: number;
    projectId: string;
    spaceId: string;
    total?: number;
  }

  interface FetchGroupListBySpaceParams {
    currentPage?: number;
    currentPageActual?: number;
    orderBy?: string;
    pageSize?: number;
    selectGroupName?: string;
    projectId: string;
    spaceId: string;
    xsc?: string;
  }

  interface addSpaceParams {
    cid: string; // 子节点，如果向上级增加空间，传1，往下级增加空间，传0
    guestsNum?: number; // 入住人数
    labelIds?: string[]; // 标签集合
    pid: string; // 父空间id
    projectId: string;
    projectType: string; // 01-照明电工,02-智能门锁
    spaceLevel: number; // 园区：1 楼栋：2 楼层：3 区域：4
    spaceName: string; // 空间名称
  }

  interface addSpaceBatchParams {
    cid: string; // 子节点，如果向上级增加空间，传1，往下级增加空间，传0
    guestsNum?: number; // 入住人数
    labelIds?: string[]; // 标签集合
    pid: string; // 父空间id
    projectId: string;
    projectType: string; // 01-照明电工,02-智能门锁
    spaceLevel: number; // 园区：1 楼栋：2 楼层：3 区域：4

    startNum: string; // 开始编号
    num: number; // 数量
  }

  interface editSpaceParams {
    spaceId: string; // 空间id
    spaceName?: string; // 空间名称
    guestsNum?: number; // 入住人数
    labelIds?: string[]; // 标签集合
  }

  interface queryRoomParams {
    projectId: string;
    currentPage?: number; // 当前页码（ 默认从1开始，后台将自动减1）
    labelIds?: string[]; // 标签集合
    orderBy?: string; // 排序字段
    pageSize?: number; // 每页数量 ( 默认每一页10条)
    spaceId: string; // 空间id
    type?: number; // 默认标签：0-所有房间，1-空置房间，2-有人房间，3-即将到期，4-超期房间，5-锁定房间
    xsc?: string; // 升序 ASC / 降序 DESC
  }

  type MzgdPropertyDTO = {
    [key: string]: {
      ButtonMode: number;
      power: number;
      OnOff: number;
      buttonMode: number;
    };
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  type SwitchInfoDTO = {};

  type Device = {
    deviceId: string;
    modelName: string;
    deviceName: string;
    devicePic: string;
    deviceType: number;
    proType: string;
    onLineStatus: number;
    gatewayId: string;
    updateStamp: number;
  };

  type ControlAction = {
    power: number;
    brightness: number;
    colorTemperature: number;
    OnOff: number;
    Level: number;
    ColorTemp: number;
  };

  type ColorTempRangeMap = {
    minColorTemp: number;
    maxColorTemp: number;
  };

  type GroupData = {
    groupName: string;
    groupPic: string;
    groupId: string;
    spaceName: string;
    spaceId: string;
    deviceType: number;
    proType: string;
    orderNum: number;
    groupDeviceList: Device[];
    controlAction: ControlAction[];
    colorTempRangeMap: ColorTempRangeMap;
    onLineStatus: number;
    projectId: string;
    groupControlId: number;
    updateStamp: number;
  };

  type MzgdPropertyDTOList = {
    [key: string]: MzgdPropertyDTO;
  };

  type DeviceInContentItem = {
    deviceName: string | null;
    pic: string;
    deviceId: string;
    spaceName: string;
    spaceId: string;
    gatewayName: string | null;
    gatewayId: string | null;
    version: string;
    deviceType: number;
    proType: string;
    switchInfoDTOList: SwitchInfoDTO[] | null;
    mzgdPropertyDTOList: MzgdPropertyDTOList | null;
    methodList: null;
    onLineStatus: number;
    orderNum: number;
    sn: null;
    lightRelId: null;
    productId: string;
    groupDeviceList: null;
    controlAction: null;
    projectName: null;
    isScreenGateway: null;
    channel: null;
    panId: null;
    extPanId: null;
    updateStamp: null;
    tmpDeviceId: null;
    tmpSwitchId: null;
    projectId: null;
    // ... 其他属性
  };

  type Pageable = {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };

  interface FetchDeviceListBySpaceRes<T> {
    content: T[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    numberOfElements: number;
    first: boolean;
    size: number;
    number: number;
    empty: boolean;
  }

  type PageSpace = ApiCommon.PageList<Space>;
}

declare namespace ApiScene {
  type effectiveTime = {
    startTime: string;
    endTime: string;
    timePeriod: string;
    timeType: string; // 时间类型，0-仅一次，1-自定义，2-法定工作日，3-法定节假日
  };
  type TimeCondition = {
    time: string;
    timePeriod: string;
    timeType: string;
  };
  type DeviceCondition = {
    deviceId: string;
    deviceName: string;
    controlEvent: { deviceName: string }[];
  };
  /** 场景 */
  type Scene = {
    sceneId: string;
    sceneName: string;
    timeConditions: TimeCondition[];
    effectiveTime: effectiveTime;
    isEnabled: string;
    sceneDesc?: string; // 通过timeConditions或effectiveTime或deviceConditions生成sceneDesc
    spaceName: string;
    spaceId: string;
    deviceConditions: DeviceCondition[];
  };

  type SceneLog = {
    sceneId: string;
    sceneName: string;
    reportAt: string;
    errorCode: number;
    reportTs: number;
  };
  type PageScene = ApiCommon.PageList<Scene>;

  type apiSceneLog = SceneLog[];

  type fetchSceneParams = {
    currentPage?: number;
    pageSize: number;
    projectId: string;
    selectSceneName?: string;
    selectSceneType: string; //	查询的场景类型,0-一键场景,1-日程,2-自动场景
    spaceId?: string;
  };

  type fetchSceneLogParams = {
    count?: number;
    projectId: string;
    reportTs?: number;
  };
}

declare namespace ApiDevice {
  type ZigbeeLight = {
    BcReportTime: number;
    ColorTemp: number;
    Duration: number;
    LampProtocol: string;
    Level: number;
    OnOff: 0 | 1;
    brightness: number;
    colorTempRange: {
      minColorTemp: number;
      maxColorTemp: number;
    };
    colorTemperature: number;
    lampProtocol: string;
    power: 0 | 1;
  };

  type PanelItem = {
    ButtonMode: 0 | 1 | 2 | 3 | 4;
    power: 0 | 1;
    OnOff: 0 | 1;
    buttonMode: 0 | 1 | 2 | 3 | 4;
    bindSceneList: Array<{
      sceneIcon: string;
      sceneId: string;
      sceneName: string;
    }>;
  };

  type SwitchInfo = {
    switchId: string;
    panelId: string;
    switchName: string;
    houseId: string | null;
    roomId: string | null;
    roomName: string | null;
    pic: string;
    switchRelId: string | null;
    orderNum: number;
    lightRelId: string | null;
    tmpSwitchId: string | null;
  };

  interface DetailRes {
    deviceName: string;
    pic: string;
    deviceId: string;
    spaceName: string;
    spaceId: string;
    gatewayName: string | null;
    gatewayId: string;
    version: string;
    deviceType: number;
    proType: string;
    switchInfoDTOList: SwitchInfo[];
    mzgdPropertyDTOList: {
      light?: ZigbeeLight;
      wallSwitch1?: PanelItem;
      wallSwitch2?: PanelItem;
      wallSwitch3?: PanelItem;
      wallSwitch4?: PanelItem;
      '1'?: ZigbeeLight | PanelItem;
      '2'?: PanelItem;
      '3'?: PanelItem;
      '4'?: PanelItem;
    };
    methodList: null;
    onLineStatus: number;
    orderNum: number;
    sn: string | null;
    lightRelId: string | null;
    productId: string;
    groupDeviceList: null;
    controlAction: null;
    projectName: null;
    isScreenGateway: null;
    channel: null;
    panId: null;
    extPanId: null;
    updateStamp: null;
    tmpDeviceId: null;
    tmpSwitchId: null;
    projectId: string;
  }

  interface SensorLog {
    projectId: string;
    spaceId: string;
    reportAt: string;
    reportTs: number;
    content: string;
    devId: null;
  }

  interface GroupDevice {
    deviceId: string;
    modelName: string;
    deviceName: string;
    devicePic: string;
    deviceType: number;
    proType: string;
    onLineStatus: number;
    gatewayId: string;
    updateStamp: number;
  }

  interface GroupControlAction {
    power: number;
    brightness: number;
    colorTemperature: number;
    OnOff: number;
    Level: number;
    ColorTemp: number;
  }

  interface ColorTempRangeMap {
    minColorTemp: number;
    maxColorTemp: number;
  }

  type Group = {
    groupName: string;
    groupPic: string;
    groupId: string;
    spaceName: string;
    spaceId: string;
    deviceType: number;
    proType: string;
    orderNum: number;
    groupDeviceList: GroupDevice[];
    controlAction: GroupControlAction[];
    colorTempRangeMap: ColorTempRangeMap;
    onLineStatus: number;
    projectId: string;
    groupControlId: number;
    updateStamp: number;
  };

  type Lock = {
    imei: string;
    deviceId: string;
    iccid: string;
    spaceName: string;
    batteryPower: number;
    onLineStatus: number;
    lockSignal: string;
  };

  type Personal = {
    mobilePhone: string;
    roleLevel: number;
    roleLevelName: string;
    spaceId: string | null;
    spaceName: string | null;
    userId: string;
    userName: string;
    validDate: string | null;
  };

  type LockLog = {
    sn: string;
    deviceId: string;
    content: string;
    createTime: string;
    userType: '0' | '1' | '2';
    userId: string;
    eventType: '0' | '1';
    eventTime: string;
    userName: string;
  };
}

declare namespace ApiCheckIn {
  interface membersCheckInParams {
    nickName: string; // 入住人名
    startTime: string; // 开始时间 格式：YYYY-MM-DD HH:mm
    endTime: string; // 结束时间 格式：YYYY-MM-DD HH:mm
    mobilePhone: string; // 手机号码
  }

  interface membersExtendParams {
    userId: string; // 用户id
    startTime: string; // 开始时间 格式：YYYY-MM-DD HH:mm
    endTime: string; // 结束时间 格式：YYYY-MM-DD HH:mm
  }

  interface membersCheckOutParams {
    userId: string; // 用户id
  }

  interface roomLogParams {
    spaceId: string;
    count?: number;
    reportTs?: number;
  }

  type roomLog = {
    eventCode: string;
    eventName: string;
    projectId: string;
    reportAt: string;
    reportTs: number;
    spaceId: string;
    spaceName: string;
    userId: string;
    userName: string;
  };
}

declare namespace ApiApartSetting {
  type Label = {
    labelId: string; // 标签id
    parentId: string; // 标签类型，父类标签id，父类最高级用0表示
    property: string; // 标签属性
    isEnabled: number; // 是否启动，0-否，1-是
    childLabelList: Label[]; // 属性值集合
  };

  interface addLabelParams {
    projectId: string; // 项目id
    property: string; // 标签属性
    propertyValue?: string; // 便签属性值,例如：1人/2人/4人/6人，用/隔开
    isEnabled: number; // 是否启动，0-否，1-是
  }

  interface updateLabelParams {
    projectId: string; // 项目id
    labelId?: string; // 标签id
    property?: string; // 标签属性
    isEnabled?: number; // 是否启动，0-否，1-是
    childLabelList?: updateLabelParams[];
  }

  interface newAdminPasswordParams {
    spaceId: string;
    password: string;
    captcha: string;
  }

  interface findAdminPasswordParams {
    spaceId: string;
    captcha: string;
  }

  interface passwordLogParams {
    projectId: string;
    count?: number; // 分页条数
    reportTs?: number; // 每次分页之后最后一条数据的时间戳
  }

  type passwordLog = {
    projectId: string;
    mobilePhone: string;
    password: string;
    reportAt: string;
    reportTs: number;
    spaceId: string;
    spaceName: string;
    userId: string;
    userName: string;
  };
}
