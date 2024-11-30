const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GamerLending Contract", function () {
    let GamerLending, gamerLending, owner, addr1, addr2, addr3;

    beforeEach(async function () {
        // Use `waitForDeployment()` in place of `deployed()`
        GamerLending = await ethers.getContractFactory("GamerLending");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        gamerLending = await GamerLending.deploy();
        await gamerLending.waitForDeployment(); // Wait for the contract to be deployed
    });

    it("Should allow creating a donation campaign", async function () {
        await gamerLending.createCampaign(
            owner.address,
            "Help me build a gaming rig",
            "Need funds to upgrade my PC",
            ethers.parseEther("10"), // Use `ethers.parseEther` in Ethers v6
            0,
            Math.floor(Date.now() / 1000) + 86400, // 1 day deadline
            0 // Donation campaign type
        );

        const campaign = await gamerLending.campaigns(0);

        expect(campaign.owner).to.equal(owner.address);
        expect(campaign.title).to.equal("Help me build a gaming rig");
        expect(campaign.description).to.equal("Need funds to upgrade my PC");
        expect(campaign.target.toString()).to.equal(ethers.parseEther("10").toString());
        expect(campaign.campaignType).to.equal(0); // Donation
    });

    it("Should allow creating a loan campaign", async function () {
        await gamerLending.createCampaign(
            owner.address,
            "Fund my tournament expenses",
            "Need loan for traveling to a gaming tournament",
            ethers.parseEther("5"),
            ethers.parseEther("6"), // Repayment Amount
            Math.floor(Date.now() / 1000) + 86400, // 1 day deadline
            1 // Loan campaign type
        );

        const campaign = await gamerLending.campaigns(0);

        expect(campaign.owner).to.equal(owner.address);
        expect(campaign.title).to.equal("Fund my tournament expenses");
        expect(campaign.repaymentAmount.toString()).to.equal(ethers.parseEther("6").toString());
        expect(campaign.campaignType).to.equal(1); // Loan
    });

    it("Should allow backers to donate to a campaign", async function () {
        await gamerLending.createCampaign(
            owner.address,
            "Help me build a gaming rig",
            "Need funds to upgrade my PC",
            ethers.parseEther("10"),
            0,
            Math.floor(Date.now() / 1000) + 86400, // 1 day deadline
            0 // Donation campaign type
        );

        await gamerLending.connect(addr1).backCampaign(0, { value: ethers.parseEther("1") });
        await gamerLending.connect(addr2).backCampaign(0, { value: ethers.parseEther("2") });

        const campaign = await gamerLending.campaigns(0);
        expect(campaign.amountCollected.toString()).to.equal(ethers.parseEther("3").toString());

        const backers = await gamerLending.getBackers(0);
        expect(backers[0][0]).to.equal(addr1.address); // First backer address
        expect(backers[1][0].toString()).to.equal(ethers.parseEther("1").toString()); // First donation
    });

    it("Should allow repaying a loan", async function () {
        // Create a loan campaign
        await gamerLending.createCampaign(
            owner.address,
            "Fund my tournament expenses",
            "Need loan for traveling to a gaming tournament",
            ethers.parseEther("5"),
            ethers.parseEther("6"), // Repayment amount
            Math.floor(Date.now() / 1000) + 86400, // 1 day deadline
            1 // Loan campaign type
        );

        // Lenders back the campaign
        await gamerLending.connect(addr1).backCampaign(0, { value: ethers.parseEther("3") });
        await gamerLending.connect(addr2).backCampaign(0, { value: ethers.parseEther("2") });

        // Borrower repays the loan
        await gamerLending.connect(owner).repayLoan(0, { value: ethers.parseEther("6") });

        const campaign = await gamerLending.campaigns(0);
        expect(campaign.isRepaid).to.equal(true);
    });

    it("Should get remaining amount to be collected", async function () {
        await gamerLending.createCampaign(
            owner.address,
            "Help me build a gaming rig",
            "Need funds to upgrade my PC",
            ethers.parseEther("10"),
            0,
            Math.floor(Date.now() / 1000) + 86400, // 1 day deadline
            0 // Donation campaign type
        );

        await gamerLending.connect(addr1).backCampaign(0, { value: ethers.parseEther("4") });

        const remaining = await gamerLending.getRemainingAmount(0);
        expect(remaining.toString()).to.equal(ethers.parseEther("6").toString());
    });
});
