"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";

const WalletConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal}>Connect Wallet</Button>
                );
              }

              if (chain.unsupported) {
                return <Button onClick={openChainModal}>Wrong network</Button>;
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnectButton;
