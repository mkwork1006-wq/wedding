import { SectionShell, SurfaceCard } from "../components/ui";

function TempPage() {
  return (
    <SectionShell
      id="temp"
      eyebrow="準備中"
      title="仮"
      description="追加コンテンツを検討中です。決まり次第ご案内します。"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <SurfaceCard tone="muted" className="p-5">
          <p className="text-sm font-semibold text-[color:var(--ink)]">候補メモ</p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            アクセス情報やタイムラインなど、必要に応じて追加予定です。
          </p>
        </SurfaceCard>
        <SurfaceCard tone="muted" className="p-5">
          <p className="text-sm font-semibold text-[color:var(--ink)]">共有方法</p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            更新後にトップのボタンからすぐ確認できるようにします。
          </p>
        </SurfaceCard>
      </div>
    </SectionShell>
  );
}

export default TempPage;
