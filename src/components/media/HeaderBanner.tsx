import { asset } from "@/lib/asset";
import MediaLoop from "@/components/media/MediaLoop";
import StillToggle from "@/components/ledger/StillToggle";

/**
 * The framed banner in a page header: 854 × 480, 480p, never larger than its source. Stacked after the text below 1280 px,
 * in the right five columns from there. `stillToggle` adds "Turn animations off" under it on the routes that lack the ledger.
 */
const HeaderBanner = ({ name, stillToggle }: { name: string; stillToggle?: boolean }) => (
  <div className="banner-slot mt-6 md:mt-8 xl:col-span-5 xl:mt-0 xl:self-end">
    <div className="md:max-w-[640px] xl:max-w-none">
      <MediaLoop src={asset(`/media/banners/${name}`)} width={854} height={480} maxWidth={854} mode="loop" eager />
      {stillToggle ? <StillToggle /> : null}
    </div>
  </div>
);

export default HeaderBanner;
