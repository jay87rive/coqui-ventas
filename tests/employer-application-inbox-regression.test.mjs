import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const api = await readFile(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("employer inbox uses its dedicated secure database result", () => {
  assert.match(api, /rpc\/get_employer_job_applications/);
  assert.match(api, /method:"POST"/);
  assert.doesNotMatch(api, /jobs\.employers\.owner_user_id=eq/);
});

test("employer inbox maps job and candidate data without client-side joins", () => {
  assert.match(api, /jobs:\{ title:row\.job_title/);
  assert.match(api, /display_name:row\.display_name/);
  assert.match(api, /skills:row\.skills \|\| \[\]/);
});

test("employer portal loads and renders the real application collection", () => {
  assert.match(page, /getMyJobApplications\(session\.access_token, session\.user\.id, mode === "employer"\)/);
  assert.match(page, /quickClickApplications\.length/);
  assert.match(page, /filteredCandidates\.map\(\(application\)/);
});
