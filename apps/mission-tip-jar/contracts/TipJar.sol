// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Tip Jar 🍺 — 一个学习用的极简打赏合约
/// @notice 任何人可以留言 + 附带打赏 ETH；owner 可以提现
/// @dev Mission 项目专用，特意保持简单，覆盖 payable / storage / event 三件套
contract TipJar {
    // ───── 数据结构 ─────
    struct Tip {
        address from;
        uint256 amount;
        string  message;
        uint256 timestamp;
    }

    // ───── 存储 ─────
    address public owner;
    Tip[] private tips;              // 所有留言（不 public 是因为 struct 数组的默认 getter 不够好用，我们自己写 getMessage）
    uint256 public totalTips;        // 累计打赏次数（gas 便宜的读法）

    // ───── 事件 ─────
    event NewTip(address indexed from, uint256 amount, string message);
    event Withdrawn(address indexed to, uint256 amount);

    // ───── 构造 ─────
    constructor() {
        owner = msg.sender;
    }

    // ───── 写方法 ─────

    /// @notice 打赏 + 留言。value 就是这次打赏的 ETH，可以是 0（纯留言不给钱）
    function tip(string calldata message) external payable {
        require(bytes(message).length > 0, "message empty");
        require(bytes(message).length <= 280, "message too long");

        tips.push(Tip({
            from: msg.sender,
            amount: msg.value,
            message: message,
            timestamp: block.timestamp
        }));
        totalTips += 1;

        emit NewTip(msg.sender, msg.value, message);
    }

    /// @notice owner 提现全部合约余额
    function withdraw() external {
        require(msg.sender == owner, "not owner");
        uint256 bal = address(this).balance;
        require(bal > 0, "nothing to withdraw");

        // 用 call 更稳（不受 2300 gas 限制），把 balance 一次性拿走
        (bool ok, ) = payable(owner).call{value: bal}("");
        require(ok, "withdraw failed");

        emit Withdrawn(owner, bal);
    }

    // ───── 读方法 ─────

    /// @notice 读第 index 条留言（0 是最早的）
    function getMessage(uint256 index) external view returns (
        address from,
        uint256 amount,
        string memory message,
        uint256 timestamp
    ) {
        require(index < tips.length, "index out of range");
        Tip storage t = tips[index];
        return (t.from, t.amount, t.message, t.timestamp);
    }

    /// @notice 合约当前余额（便利函数，前端也可以直接用 provider.getBalance(address)）
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
