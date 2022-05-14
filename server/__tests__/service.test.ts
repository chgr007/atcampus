import GroupService from "../service/groupService";
import { IGroupRepo } from "../repo/IGroupRepo";
import { createMock } from "ts-auto-mock";
import { method, On } from "ts-auto-mock/extension";
import { groups } from "../__mocks__/mockData";
import { IGroupService } from "../service/IGroupService";

describe("it should run tests on all services", () => {
  let fakeGroupRepo: IGroupRepo;
  let groupService: IGroupService;
  beforeEach(() => {
    fakeGroupRepo = createMock<IGroupRepo>();
    groupService = new GroupService(fakeGroupRepo);
  });

  it("Should return array of groups", async () => {
    const mockFetchGroups: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.fetchAllGroups)
    );
    mockFetchGroups.mockImplementation(async () => groups);
    const result = await groupService.fetchAllGroups();
    expect(result.length > 0).toBe(true);
  });

  it("Should return group on add", async () => {
    const mockAddGroup: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.addGroup)
    );
    mockAddGroup.mockImplementation(async () => {
      return groups[0];
    });

    const res = await groupService.addGroup(groups[0]);
    expect(res.name).toBe(groups[0].name);
  });

  it("Should return group by ID", async () => {
    const mockFetchById: jest.Mock = On(fakeGroupRepo).get(
      method((method) => method.fetchGroupById)
    );
    mockFetchById.mockImplementation(async () => groups[0]);
    const res = await fakeGroupRepo.fetchGroupById("1");
    expect(res.name).toBe(groups[0].name);
  });
});
