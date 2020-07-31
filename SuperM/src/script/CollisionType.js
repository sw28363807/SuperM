export default class CollisionType extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }
}

// 0x0000 = 0
// 0x0001 = 1
// 0x0002 = 2
// 0x0004 = 4
// 0x0008 = 8
// 0x0010 = 16
// 0x0020 = 32
// 0x0040 = 64
// 0x0080 = 128
// 0x0100 = 256
// 0x0200 = 512
// 0x0400 = 1024
// 0x0800 = 2048
// 0x1000 = 4096
// 0x2000 = 8192
// 0x4000 = 16384
// 0x8000 = 32768

// GroundCategory = 1;
// RoleCategory = 2;
// BrickCategory = 4;
// RewardCategory = 8;
// RoleBulletCategory = 16;
// MonsterCategory = 32;
// MasterBulletCategory = 64;

// GroundMask = RoleCategory + BrickCategory + RewardCategory + RoleBulletCategory + MonsterCategory;
// RoleMask = GroundCategory + BrickCategory + RewardCategory + MonsterCategory;
// BrickMask = RoleCategory + RewardCategory + RoleBulletCategory + MonsterCategory;
// RewardMask = RoleCategory + GroundCategory + BrickCategory;
// RoleBulletMask = GroundCategory + BrickCategory + MonsterCategory;
// MonsterMask = GroundCategory + BrickCategory + RewardCategory + RoleBulletCategory;