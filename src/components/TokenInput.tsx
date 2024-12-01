import { Input } from "./ui/input";

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  tokenName: string;
  balance: number;
  onMaxClick: () => void;
  hasError: boolean;
}

const TokenInput = ({
  id,
  value,
  onChange,
  tokenName,
  balance,
  onMaxClick,
  hasError,
}: Props) => {
  return (
    <div
      className={`p-4 border rounded-lg ${
        hasError ? "border-red-500" : "border-gray-300"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium border px-4 py-1 rounded-full bg-orange-200 border-orange-700">
            {tokenName}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Balance: {balance.toFixed(8)}
          <button
            type="button"
            onClick={onMaxClick}
            className="ml-2 text-blue-500 hover:underline"
            data-testid={`${id}-max`}
          >
            MAX
          </button>
        </div>
      </div>

      <Input
        id={id}
        data-testid={id}
        type="text"
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default TokenInput;
