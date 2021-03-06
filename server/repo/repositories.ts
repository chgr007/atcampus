import { AppDataSource } from "./AppDataSource";
import { UserEntity } from "../entity/UserEntity";
import { ChatMessageEntity } from "../entity/ChatMessageEntity";
import { CriteriaEntity } from "../entity/CriteriaEntity";
import { GroupMemberEntity } from "../entity/GroupMemberEntity";
import { GroupEntity } from "../entity/GroupEntity";
import { GroupRequestEntity } from "../entity/GroupRequestEntity";
import { SchoolEntity } from "../entity/SchoolEntity";
import { SubjectEntity } from "../entity/SubjectEntity";
import { Repository } from "typeorm";

type repoTypes = {
  userRepo: Repository<UserEntity>;
  chatMessageRepo: Repository<ChatMessageEntity>;
  criteriaRepo: Repository<CriteriaEntity>;
  groupMemberRepo: Repository<GroupMemberEntity>;
  groupRequestRepo: Repository<GroupRequestEntity>;
  groupRepo: Repository<GroupEntity>;
  schoolRepo: Repository<SchoolEntity>;
  subjectRepo: Repository<SubjectEntity>;
};

// TODO: Bør kanskje ha dette som en singleton, eller det det slik object literals funker i js out of the box? Sjekke opp...
export const repositories: Promise<repoTypes> = (() => {
  return AppDataSource.initialize().then((dataSource) => {
    return {
      userRepo: dataSource.getRepository(UserEntity),
      chatMessageRepo: dataSource.getRepository(ChatMessageEntity),
      criteriaRepo: dataSource.getRepository(CriteriaEntity),
      groupMemberRepo: dataSource.getRepository(GroupMemberEntity).extend({
        // filtreres til GroupMemberEntity.users
        findUsers(group_uuid: string) {
          return this.createQueryBuilder("members")
            .where("members.group_uuid = :group_uuid", { group_uuid })
            .getMany();
        },

        findGroups(user_uuid: string) {
          return this.createQueryBuilder("members")
            .where("members.user_uuid = :user_uuid", { user_uuid })
            .getMany();
        },
      }),
      groupRequestRepo: dataSource.getRepository(GroupRequestEntity),
      groupRepo: dataSource.getRepository(GroupEntity).extend({
        // custom metoder settes her
        deleteById(group_uuid: string) {
          return this.createQueryBuilder()
            .delete()
            .from(GroupEntity)
            .where("uuid = :uuid", { group_uuid })
            .execute();
        },

        findByName(name: string) {
          return this.findOneBy({ name: name });
        },
      }),
      schoolRepo: dataSource.getRepository(SchoolEntity).extend({
        async findOrCreate(school: SchoolEntity): Promise<SchoolEntity> {
          return await this.findOneByOrFail({ name: school.name }).then(
            async (foundSchool) => {
              if (!foundSchool) {
                return this.save(school).then((savedSchool) => {
                  return savedSchool;
                });
              }
              return foundSchool;
            }
          );
        },
      }),
      subjectRepo: dataSource.getRepository(SubjectEntity).extend({
        async findOrCreate(subject: SubjectEntity): Promise<SubjectEntity> {
          return await this.findOneByOrFail({ name: subject.name }).then(
            async (foundSubject) => {
              if (!foundSubject) {
                return await this.save(subject).then((savedSubject) => {
                  return savedSubject;
                });
              }
              return foundSubject;
            }
          );
        },
      }),
    };
  });
})();
