function TopPage() {
  return (
    <section className="space-y-6" id="hero">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#8a8a8a]">tomotomo</p>
        <h1 className="text-4xl font-semibold leading-tight text-[#1f1f1f] md:text-5xl">
          清潔感のある白に、光と時間の余韻をのせたWedding Page。
        </h1>
        <p className="text-base text-[#4c4c4c]">
          入口から続く余白に沿ってストーリーを紡ぎ、ゲストが自分らしくいられる祝福をデザインします。
        </p>
      </div>
      <div className="space-y-3 rounded-[26px] border border-[#efeded] bg-[#fafafa] p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#a1125a]">memory</p>
        <h2 className="text-2xl font-semibold text-[#1f1f1f]">しなやかなヴォールト</h2>
        <p className="text-sm text-[#4c4c4c]">
          柔らかなラインで構成された空間は、ガラス越しの光を取り入れて心地よい流れをつくります。
        </p>
      </div>
    </section>
  );
}

export default TopPage;
