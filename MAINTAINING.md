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

Then edit the automatically created GitHub Releases draft and publish.

Once the release is published you can automatically generate a signed checksum file with:

```
$ ./signedchecksum
```

It will create a file called `SHASUMS256.txt.asc` that you need to upload to the GitHub release manually.
