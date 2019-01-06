# Maintaining

## Dev

### Run

```
$ yarn start
```

### Release

**Only do a new release when you can be available in the next hours to handle any issues. Prefer doing a new release in the morning your time.**

Ensure the app works without any issues on our supported platforms, by running:

```
$ yarn dist
```

And then test the binaries on macOS, Linux, and Windows:

- Test with the settings and portfolios from the previous version, then do a "Delete App Data" and test it fresh to ensure there are no issues for a first-time user.
- Test the inputs, modals, etc.
- Test that you can successfully buy and sell in the exchange.
- Click random things to ensure no unexpected behavior.

If everything works fine, release it:

```
$ yarn release
```

Then edit the automatically created GitHub Releases draft, remove the `*.blockmap` files, and publish.

Once the release is published, you can automatically generate a signed checksum file with:

```
$ ./signedchecksum
```

It will create a file called `SHASUMS256.txt.asc` that you need to upload to the GitHub release manually.

## External Contributions

We need to be very careful accepting external contributions, especially adding new currencies and Electrum servers. An imposter could add what appears to be an official token or coin. If it's an ERC20 token and the contract address is fake, they could sell worthless tokens as what appear to be an established token. If it's a standalone currency and the Electrum servers are malicious, they could essentially reverse swaps by only fulfilling them on their fake Electrum chain but not on the real chain.

Before accepting external contributions adding new currencies we should:

- Verify the ERC20 contract address is genuine.
- Verify the Electrum servers are genuine.
