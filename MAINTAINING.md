# Maintaining

## Dev

### Run

```
$ yarn start
```

### Release

```
$ yarn release
```

Then edit the automatically created GitHub Releases draft and publish.

Once the release is published you can automatically generate a signed checksum file with:

```
$ ./signedchecksum
```

It will create a file called `SHASUMS256.txt.asc` that you need to upload to the GitHub release manually.
