import { SOCIAL_LINKS } from "@/constants/links";
import { Logo, Footer as FooterCore } from "@mochi-ui/core";
import { X, Discord, Telegram } from "@mochi-ui/icons";

export const Footer = () => {
  return (
    <FooterCore
      className="[&>*]:px-4 lg:[&>*]:px-8"
      copyrightText="Copyright © 2024 Tono, All rights reserved"
      logo={<Logo className="!h-8 !w-8" />}
      nav={[
        {
          title: "Developers",
          links: [
            { href: SOCIAL_LINKS.DOCUMENT, text: "Documentation" },
            { href: SOCIAL_LINKS.GITHUB, text: "GitHub" },
          ],
        },
        {
          title: "Resources",
          links: [{ href: SOCIAL_LINKS.CHANGELOG, text: "Changelog" }],
        },
        {
          title: "Company",
          links: [
            { href: SOCIAL_LINKS.DISCORD, text: "Contact" },
            { href: SOCIAL_LINKS.TWITTER, text: "Twitter" },
          ],
        },
      ]}
      social={[
        { href: SOCIAL_LINKS.TWITTER, Icon: X, title: "X" },
        { href: SOCIAL_LINKS.DISCORD, Icon: Discord, title: "Discord" },
        { href: SOCIAL_LINKS.TELEGRAM, Icon: Telegram, title: "Telegram" },
      ]}
    />
  );
};
