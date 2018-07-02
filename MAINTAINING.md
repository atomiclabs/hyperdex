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

It will create a file called `SHASUMS256.txt.asc`, you should manually upload this file to the GitHub release.
