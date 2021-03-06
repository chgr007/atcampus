import { createMock } from "ts-auto-mock";
import { method, On } from "ts-auto-mock/extension";
import {
  groupEntitiesWithUsers,
  groupInDtos,
  groupMemberEntities,
  userEntitiesWithGroups,
} from "../__mocks__/mockData";
import { DeleteResult, Repository } from "typeorm";
import { UserEntity } from "../entity/UserEntity";
import { SchoolEntity } from "../entity/SchoolEntity";
import { GroupEntity } from "../entity/GroupEntity";
import { IUserService } from "../service/IUserService";
import UserService from "../service/userService";
import { UserDto } from "../dto/userDto";
import { GroupMemberEntity } from "../entity/GroupMemberEntity";
import { SubjectEntity } from "../entity/SubjectEntity";
import { CriteriaEntity } from "../entity/CriteriaEntity";
import GroupService from "../service/groupService";
import { CriteriaDto } from "../dto/criteriaDto";
import { GradeGoal } from "../entity/enums/GradeGoal";
import { WorkFrequency } from "../entity/enums/WorkFrequency";
import { MaxSize } from "../entity/enums/MaxSize";
import { WorkType } from "../entity/enums/WorkType";
import { ChatMessageEntity } from "../entity/ChatMessageEntity";

describe("Tests for GroupService", () => {
  let fakeGroupRepo: Repository<GroupEntity>;
  let fakeGroupMemberRepo: Repository<GroupMemberEntity>;
  let fakeSchoolRepo: Repository<SchoolEntity>;
  let fakeSubjectRepo: Repository<SubjectEntity>;
  let fakeUserRepo: Repository<UserEntity>;
  let fakeCriteriaRepo: Repository<CriteriaEntity>;
  let fakeChatMessageRepo: Repository<ChatMessageEntity>;
  let groupService: GroupService;

  // jest.mock("../dto/utils/groupMappers");
  beforeEach(() => {
    fakeGroupRepo = createMock<Repository<GroupEntity>>();
    fakeGroupMemberRepo = createMock<Repository<GroupMemberEntity>>();
    fakeSchoolRepo = createMock<Repository<SchoolEntity>>();
    fakeSubjectRepo = createMock<Repository<SubjectEntity>>();
    fakeUserRepo = createMock<Repository<UserEntity>>();
    fakeCriteriaRepo = createMock<Repository<CriteriaEntity>>();
    fakeChatMessageRepo = createMock<Repository<ChatMessageEntity>>();
    groupService = new GroupService(
      fakeGroupRepo,
      fakeGroupMemberRepo,
      fakeSchoolRepo,
      fakeSubjectRepo,
      fakeUserRepo,
      fakeCriteriaRepo,
      fakeChatMessageRepo
    );
  });

  it("Should return array of groups", async () => {
    const mockFetchGroups: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.findBy)
    );
    mockFetchGroups.mockImplementation(async () => groupEntitiesWithUsers());
    const result = await groupService.fetchAllGroups();
    expect(result.length > 0).toBe(true);
  });

  it("Should return group on add", async () => {
    const mockAddGroup: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.save)
    );
    mockAddGroup.mockImplementation(async () => {
      return groupEntitiesWithUsers()[0];
    });

    const res = await groupService.addGroup(groupInDtos[0], "1");
    expect(res.name).toBe(groupInDtos[0].name);
  });

  it("Should return group by ID", async () => {
    const mockFetchById: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.findOneBy)
    );
    mockFetchById.mockImplementation(async () => groupEntitiesWithUsers()[0]);
    const res = await groupService.fetchGroupById("1");
    expect(res.name).toBe(groupEntitiesWithUsers()[0].name);
  });

  it("Should delete a member from a group", async () => {
    const mockDeleteMember: jest.Mock = On(fakeGroupMemberRepo).get(
      method((method) => method.remove)
    );
    mockDeleteMember.mockImplementation(async () => groupMemberEntities());

    const mockFindMember: jest.Mock = On(fakeGroupMemberRepo).get(
      method((repo) => repo.findOneBy)
    );
    mockFindMember.mockImplementation(async () => groupMemberEntities()[1]);

    const mockGetUser: jest.Mock = On(fakeUserRepo).get(
      method((repo) => repo.findOneBy)
    );
    mockGetUser.mockImplementation(async () => userEntitiesWithGroups()[1]);

    const mockGetGroup: jest.Mock = On(fakeGroupRepo).get(
      method((repo) => repo.findOneBy)
    );
    mockGetGroup.mockImplementation(async () => groupEntitiesWithUsers()[0]);

    const res = await groupService.deleteMember("1", "2");
    expect(res.name).toBe(groupEntitiesWithUsers()[0].name);
  });

  it("Should add a member", async () => {
    const mockAddMember: jest.Mock = On(fakeGroupMemberRepo).get(
      method((method) => method.save)
    );
    const newUser = new UserEntity(
      "codbob",
      "cod@bob.com",
      "pirate",
      new SchoolEntity(),
      "",
      "",
      "3"
    );
    const group = groupEntitiesWithUsers()[0];
    const newMember = new GroupMemberEntity();
    newMember.is_admin = false;
    newMember.user = newUser;
    newMember.group = group;
    newMember.uuid = "3";
    group.users = Promise.all([
      groupMemberEntities()[0],
      groupMemberEntities()[1],
      newMember,
    ]);
    mockAddMember.mockImplementation(async () => {
      return newMember;
    });

    const mockGetUser: jest.Mock = On(fakeUserRepo).get(
      method((repo) => repo.findOneBy)
    );
    mockGetUser.mockImplementation(async () => newUser);

    const mockGetGroup: jest.Mock = On(fakeGroupRepo).get(
      method((repo) => repo.findOneBy)
    );
    mockGetGroup.mockImplementation(async () => groupEntitiesWithUsers()[0]);

    const res = await groupService.addMember("1", "2");

    expect(res.groupMembers[2].user_uuid).toBe(newUser.uuid);
  });

  it("Should return group members", async () => {
    const mockFetchMembers: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.findOneBy)
    );
    mockFetchMembers.mockImplementation(
      async () => groupEntitiesWithUsers()[0]
    );

    const res = await groupService.fetchGroupMembers("1");
    expect(res.length > 0).toBe(true);
    expect(res[0].email).toBe(userEntitiesWithGroups()[0].email);
  });

  it("Should update a group", async () => {
    const mockUpdateGroup: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.save)
    );
    mockUpdateGroup.mockImplementation(async () => groupEntitiesWithUsers()[0]);
    const res = await groupService.updateGroup(groupInDtos[0]);

    expect(res.name).toBe(groupInDtos[0].name);
  });

  it("Should delete a group", async () => {
    const mockDeleteGroup: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.delete)
    );
    const mockDeleteMembers: jest.Mock = On(fakeGroupMemberRepo).get(
      method((repo) => repo.delete)
    );
    const mockFindGroup: jest.Mock = On(fakeGroupRepo).get(
      method((repo) => repo.findOneBy)
    );
    const mockDeleteChatMessages: jest.Mock = On(fakeChatMessageRepo).get(
      method((repo) => repo.delete)
    );
    mockDeleteGroup.mockImplementation(async () => {
      const result = new DeleteResult();
      result.affected = 1;
      return result;
    });
    mockDeleteMembers.mockImplementation(async () => {
      return [];
    });
    mockFindGroup.mockImplementation(async () => {
      return { users: ["x", "y"] };
    });
    mockDeleteChatMessages.mockImplementation(async () => {
      const result = new DeleteResult();
      result.affected = 1;
      return result;
    });

    const res = await groupService.deleteGroup("1");
    expect(res).toBe(true);
  });

  it("Should search for a group", async () => {
    const searchDto = new CriteriaDto(
      GradeGoal.A,
      WorkFrequency.W1,
      "Norsk",
      MaxSize.LARGE,
      "Oslo",
      ["PG2351"],
      WorkType.HYBRID,
      "HK"
    );

    const mockSearch: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.findBy)
    );
    mockSearch.mockImplementation(async () => groupEntitiesWithUsers());

    const res = await groupService.searchGroup(searchDto);
    expect(Object.keys(res).length > 0).toBe(true);
  });
});

describe("Tests for user service", () => {
  let fakeUserRepo: Repository<UserEntity>;
  let fakeSchoolRepo: Repository<SchoolEntity>;
  let fakeGroupRepo: Repository<GroupEntity>;
  let userService: IUserService;
  beforeEach(() => {
    fakeUserRepo = createMock<Repository<UserEntity>>();
    fakeSchoolRepo = createMock<Repository<SchoolEntity>>();
    fakeGroupRepo = createMock<Repository<GroupEntity>>();
    userService = new UserService(fakeUserRepo, fakeSchoolRepo, fakeGroupRepo);
  });

  it("Should add a user", async () => {
    const userEntity = new UserEntity(
      "testuser",
      "testuser@test.com",
      "pirate",
      new SchoolEntity("School"),
      "user",
      "usersen",
      "1"
    );
    const userDto = new UserDto("testuser", "testuser@test.com", "pirate");
    const fakeAddUser: jest.Mock = On(fakeUserRepo).get(method((m) => m.save));
    fakeAddUser.mockImplementation(async () => userEntity);
    const res = await userService.addUser(userDto);
    expect(res?.email).toBe(userEntity.email);
  });

  it("Should get a user", async () => {
    const userEntity = new UserEntity(
      "testuser",
      "testuser@test.com",
      "pirate",
      new SchoolEntity("School"),
      "user",
      "usersen",
      "1"
    );
    const fakeGetUser: jest.Mock = On(fakeUserRepo).get(
      method((m) => m.findOneBy)
    );
    fakeGetUser.mockImplementation(async () => userEntity);
    const res = await userService.findUserById("1");
    expect(res?.email).toBe(userEntity.email);
    expect(fakeGetUser).toHaveBeenCalledWith({ uuid: "1" });
  });
});
