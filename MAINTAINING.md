# Maintaining

## Dev

### Run

```
$ yarn start
```

### Release

Ensure the app works without any issues on our supported platforms.

```
$ yarn dist
```

And then test the binaries on macOS, Linux, and Windows.

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
