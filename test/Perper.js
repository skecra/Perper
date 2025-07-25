const Perper = artifacts.require("Perper");
const { expect } = require("chai");

contract("Perper", (accounts) => {
  const [owner, addr1, addr2] = accounts;
  let perperInstance;

  beforeEach(async () => {
    perperInstance = await Perper.new(1000); // deploy sa početnim supply
  });

  it("Treba da postavi ispravan naziv i simbol", async () => {
    const name = await perperInstance.name();
    const symbol = await perperInstance.symbol();
    expect(name).to.equal("Perper");
    expect(symbol).to.equal("PRP");
  });

  it("Treba da dodijeli sve tokene vlasniku", async () => {
    const totalSupply = await perperInstance.totalSupply();
    const ownerBalance = await perperInstance.balanceOf(owner);
    expect(ownerBalance.toString()).to.equal(totalSupply.toString());
  });

  it("Treba da izvrši transfer tokena između računa", async () => {
    await perperInstance.transfer(addr1, 100, { from: owner });
    const addr1Balance = await perperInstance.balanceOf(addr1);
    expect(addr1Balance.toString()).to.equal("100");
  });

  it("Treba da odbije transfer ako saldo nije dovoljan", async () => {
    try {
      await perperInstance.transfer(owner, 1, { from: addr1 });
    } catch (error) {
      expect(error.message).to.include("Insufficient balance");
    }
  });

  it("Treba da izvrši approve i transferFrom", async () => {
    await perperInstance.approve(addr1, 50, { from: owner });
    await perperInstance.transferFrom(owner, addr2, 50, { from: addr1 });
    const addr2Balance = await perperInstance.balanceOf(addr2);
    expect(addr2Balance.toString()).to.equal("50");
  });

  describe("Mint and Burn", () => {
  it("Treba da omogući owner-u da mintuje nove tokene", async () => {
    const initialSupply = await perperInstance.totalSupply();
    await perperInstance.mint(owner, 100, { from: owner });
    const newSupply = await perperInstance.totalSupply();
    const ownerBalance = await perperInstance.balanceOf(owner);

    expect(newSupply.toString()).to.equal(initialSupply.addn(100).toString());
    expect(ownerBalance.toString()).to.equal(newSupply.toString());
  });

  it("Treba da spriječi ne-owner korisnike da mintuju tokene", async () => {
    try {
      await perperInstance.mint(addr1, 100, { from: addr1 });
      assert.fail("Non-owner ne bi smio mintovati tokene");
    } catch (error) {
      expect(error.message).to.include("Only owner can mint tokens");
    }
  });

  it("Treba da omogući burn tokena iz owner balansa", async () => {
    const initialSupply = await perperInstance.totalSupply();
    await perperInstance.burn(50, { from: owner });
    const newSupply = await perperInstance.totalSupply();
    const ownerBalance = await perperInstance.balanceOf(owner);

    expect(newSupply.toString()).to.equal(initialSupply.subn(50).toString());
    expect(ownerBalance.toString()).to.equal(newSupply.toString());
  });

  it("Treba da spriječi burn više tokena nego što korisnik ima", async () => {
    try {
      await perperInstance.burn(999999, { from: addr1 }); // addr1 nema toliko tokena
      assert.fail("Burn bi trebao failovati ako nema dovoljno tokena");
    } catch (error) {
      expect(error.message).to.include("Insufficient balance to burn");
    }
  });
});

});

