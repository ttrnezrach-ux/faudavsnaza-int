import { t as createServerFn } from "./ssr.mjs";
import { a as string, i as object } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/office-lock-DwSVHa1e.js
var getOfficeLockState_createServerFn_handler = createServerRpc({
	id: "43fe37502218b3234107fd7a03e204251002d478d9606e5a3bdf98f72a830376",
	name: "getOfficeLockState",
	filename: "src/lib/office-lock.ts"
}, (opts) => getOfficeLockState.__executeServer(opts));
var getOfficeLockState = createServerFn({ method: "GET" }).handler(getOfficeLockState_createServerFn_handler, async () => {
	const { readOfficeLockState } = await import("./office-lock.server-CkekrlXK.mjs");
	return readOfficeLockState();
});
var verifyOfficeLock_createServerFn_handler = createServerRpc({
	id: "a3556e15e7eb50cb6ec926d87552b21c87d1ec7ef68df3eab6cd65351586ca99",
	name: "verifyOfficeLock",
	filename: "src/lib/office-lock.ts"
}, (opts) => verifyOfficeLock.__executeServer(opts));
var verifyOfficeLock = createServerFn({ method: "POST" }).validator((input) => object({
	code: string().max(8),
	password: string().min(1).max(128)
}).parse(input)).handler(verifyOfficeLock_createServerFn_handler, async ({ data }) => {
	const { verifyOfficeCredentials } = await import("./office-lock.server-CkekrlXK.mjs");
	return verifyOfficeCredentials(data.code, data.password);
});
var lockOfficeSession_createServerFn_handler = createServerRpc({
	id: "b623f7d635b5f9d5b37a95d1020c0f984f65c2a99ab40783659c39a5d948b097",
	name: "lockOfficeSession",
	filename: "src/lib/office-lock.ts"
}, (opts) => lockOfficeSession.__executeServer(opts));
var lockOfficeSession = createServerFn({ method: "POST" }).handler(lockOfficeSession_createServerFn_handler, async () => {
	const { clearOfficeSession } = await import("./office-lock.server-CkekrlXK.mjs");
	return clearOfficeSession();
});
//#endregion
export { getOfficeLockState_createServerFn_handler, lockOfficeSession_createServerFn_handler, verifyOfficeLock_createServerFn_handler };
