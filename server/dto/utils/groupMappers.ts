import { GroupEntity } from "../../entity/GroupEntity";
import { GroupDto } from "../groupDto";
import { criteriaDtoToEntity, criteriaEntityToDto } from "./criteriaMappers";
import { memberEntityToDto_user } from "./memberMappers";
import { GroupInDto, GroupOutDto } from "../GroupInDto";
import { UserEntity } from "../../entity/UserEntity";
import { GroupMemberEntity } from "../../entity/GroupMemberEntity";
import { v4 as uuidv4 } from "uuid";

export function groupEntityToDto(entity: GroupEntity): GroupOutDto {
  const members = entity.users.map((entity) => {
    return memberEntityToDto_user(entity);
  });

  return new GroupOutDto(
    entity.uuid,
    entity.isPrivate,
    entity.name,
    criteriaEntityToDto(entity.criteria),
    members,
    entity.rules
  );
}

export function newGroupEntityFromDto(dto: GroupInDto, admin: UserEntity) {
  const initialMember = new GroupMemberEntity();
  initialMember.user = admin;
  initialMember.is_admin = true;

  const newGroup = new GroupEntity(
    dto.name,
    criteriaDtoToEntity(dto.criteria),
    dto.isPrivate,
    [initialMember],
    dto.rules
  );

  // newGroup.uuid = uuidv4()

  initialMember.group = newGroup;

  return newGroup;
}

// export function groupDtoToEntity(dto: GroupDto): GroupEntity {
//   const members = dto.groupMembers.map((member) => {
//     return memberDtoToEntity(member);
//   });
//
//   return new GroupEntity(
//     dto.name,
//     criteriaDtoToEntity(dto.criteria),
//     dto.isPrivate,
//     members,
//     dto.rules,
//     dto.uuid
//   );
// }