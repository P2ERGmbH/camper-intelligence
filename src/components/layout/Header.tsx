import Image from 'next/image';

export function Header({ className }: { className?: string }) {
  return (
    <div className={className} data-name="Header" data-node-id="42:153">
      <div className="content-stretch flex gap-[6px] items-center justify-center leading-[1.1] relative shrink-0 text-[24px] text-white tracking-[-0.48px]" data-name="Logo" data-node-id="42:86">
        <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0" data-node-id="42:87">
          camper
        </p>
        <p className="font-['Plus_Jakarta_Sans:ExtraBold_Italic',_sans-serif] font-extrabold italic relative shrink-0" data-node-id="42:88">
          intelligence
        </p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[48px] items-center justify-center leading-[normal] min-h-px min-w-px relative shrink-0 text-[16px] text-white" data-name="Menu points" data-node-id="42:89">
        <p className="relative shrink-0" data-node-id="42:90">
          Services
        </p>
        <p className="relative shrink-0" data-node-id="42:91">
          Dashboard
        </p>
        <p className="relative shrink-0" data-node-id="42:92">
          Services
        </p>
      </div>
      <div className="bg-[#e6e5e4] border border-[#c6bbb1] border-solid box-border content-stretch flex gap-[8px] h-[35px] items-center justify-center px-[20px] py-[12px] relative rounded-[12px] shrink-0 w-[110px]" data-name="Button" data-node-id="38:226">
        <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[14px] text-black tracking-[-0.25px]" data-node-id="38:227">
          Kontakt
        </p>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0px_9px_0px_#f3f3f3]" />
      </div>
      <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Icons" data-node-id="42:95">
        <div className="relative shrink-0 size-[24px]" data-name="uil:letter-chinese-a" data-node-id="42:96">
          <Image alt="Language" className="block max-w-none size-full" src="/assets/svg/uil-letter-chinese-a.svg" width={24} height={24} />
        </div>
        <div className="relative shrink-0 size-[24px]" data-name="uil:user" data-node-id="42:98">
          <Image alt="User" className="block max-w-none size-full" src="/assets/svg/uil-user.svg" width={24} height={24} />
        </div>
        <div className="relative shrink-0 size-[24px]" data-name="uil:bars" data-node-id="42:100">
          <Image alt="Menu" className="block max-w-none size-full" src="/assets/svg/uil-bars.svg" width={24} height={24} />
        </div>
      </div>
    </div>
  );
}