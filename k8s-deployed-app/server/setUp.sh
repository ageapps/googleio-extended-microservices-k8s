#!/bin/bash          

mkdir -p $FUSE_MOUNT_DIR
gcsfuse -o allow_other $FUSE_BUCKET_NAME $FUSE_MOUNT_DIR
echo "Mounted succesfully FUSE bucket $FUSE_BUCKET_NAME in $FUSE_MOUNT_DIR"
ls $FUSE_MOUNT_DIR

