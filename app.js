/* app.js --------------------------------------------------------------- */
import { supabase } from "./supabase.js";

/* ===== 一元管理する定数 ===== */
const BUCKET_NAME = "post-images";   // 変更なし
const TABLE_NAME  = "blog_posts";    // 変更なし
/* ===================================================================== */

/* DOM 要素 */
const postForm  = document.getElementById("postForm");
const titleEl   = document.getElementById("title");
const bodyEl    = document.getElementById("body");
const fileEl    = document.getElementById("imageFile");
const postsWrap = document.getElementById("posts");

/* ---------- 投稿送信 ---------- */
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  /* バリデーション */
  const title = titleEl.value.trim();
  if (!title) {
    alert("タイトルは必須です");
    return;
  }
  const body = bodyEl.value.trim();
  let imageURL = null;

  /* 画像アップロード（任意） */
  try {
    if (fileEl.files.length > 0) {
      const file = fileEl.files[0];

      // 日本語ファイル名対策：UUID + 元拡張子
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;

      /* Storage へアップロード */
      const { error: upErr } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (upErr) throw upErr;

      /* 公開 URL 取得 */
      const { data: urlData, error: urlErr } = supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (urlErr) throw urlErr;
      imageURL = urlData.publicUrl;
    }

    /* テーブルに INSERT */
    const { error: insErr } = await supabase
      .from(TABLE_NAME)
      .insert([{ title, body, image_url: imageURL }]);

    if (insErr) throw insErr;

    /* 表示を更新 */
    postForm.reset();
    await fetchPosts();
  } catch (err) {
    alert(`投稿失敗: ${err.message || err}`);
    console.error(err);
  }
});

/* ---------- 投稿取得 ---------- */
async function fetchPosts() {
  postsWrap.innerHTML = "<p>読み込み中...</p>";

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    postsWrap.innerHTML = "<p>読み込みエラーが発生しました。</p>";
    return;
  }

  if (!data || data.length === 0) {
    postsWrap.innerHTML = "<p>まだ投稿がありません。</p>";
    return;
  }

  postsWrap.innerHTML = data.map(renderCard).join("");
}

/* ---------- カード HTML ---------- */
function renderCard(post) {
  const created = new Date(post.created_at).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return `
    <article class="post-card">
      ${post.image_url ? `<img src="${post.image_url}" alt="投稿画像">` : ""}
      <div class="inner">
        <h4>${escapeHtml(post.title)}</h4>
        <time>${created}</time>
        <p>${escapeHtml((post.body || "").slice(0, 120))}</p>
      </div>
    </article>
  `;
}

/* ---------- XSS 対策：簡易エスケープ ---------- */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );
}

/* ---------- 初期ロード ---------- */
fetchPosts();
/* --------------------------------------------------------------------- */
