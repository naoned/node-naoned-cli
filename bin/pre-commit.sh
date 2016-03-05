#!/bin/bash
# Naoned - Php Convention pre-commit hook for git
#
# @author Rémi Gebski <rgebski@naoned.fr>
# @author Jean-Baptiste Delhommeau <jbdelhommeau@naoned.fr>
#

function commit_valid {
	exit 0
}

function commit_not_valid {
	# Ascii generator : http://patorjk.com/software/taag/#p=display&h=0&f=ANSI%20Shadow&t=you%20shall%20not%20pass%20!%0A
	# echo -e "${COLOR_NOT_VALID}--------------------------------------------------------------------------------------------------------------------------------------------------\033[0m"
	echo -e "${COLOR_NOT_VALID}██╗   ██╗ ██████╗ ██╗   ██╗    ███████╗██╗  ██╗ █████╗ ██╗     ██╗         ███╗   ██╗ ██████╗ ████████╗    ██████╗  █████╗ ███████╗███████╗    ██╗\033[0m"
	echo -e "${COLOR_NOT_VALID}╚██╗ ██╔╝██╔═══██╗██║   ██║    ██╔════╝██║  ██║██╔══██╗██║     ██║         ████╗  ██║██╔═══██╗╚══██╔══╝    ██╔══██╗██╔══██╗██╔════╝██╔════╝    ██║\033[0m"
	echo -e "${COLOR_NOT_VALID} ╚████╔╝ ██║   ██║██║   ██║    ███████╗███████║███████║██║     ██║         ██╔██╗ ██║██║   ██║   ██║       ██████╔╝███████║███████╗███████╗    ██║\033[0m"
	echo -e "${COLOR_NOT_VALID}  ╚██╔╝  ██║   ██║██║   ██║    ╚════██║██╔══██║██╔══██║██║     ██║         ██║╚██╗██║██║   ██║   ██║       ██╔═══╝ ██╔══██║╚════██║╚════██║    ╚═╝\033[0m"
	echo -e "${COLOR_NOT_VALID}   ██║   ╚██████╔╝╚██████╔╝    ███████║██║  ██║██║  ██║███████╗███████╗    ██║ ╚████║╚██████╔╝   ██║       ██║     ██║  ██║███████║███████║    ██╗\033[0m"
	echo -e "${COLOR_NOT_VALID}   ╚═╝    ╚═════╝  ╚═════╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝  ╚═══╝ ╚═════╝    ╚═╝       ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝\033[0m"
	echo ""
	echo -e "\e[41m\e[97mYour commit can not be validated. Fix the errors above and try to commit again.\033[0m"
	exit 1
}

TMP_STAGING=".tmp_staging"

COLOR_VALID="\e[32m"
COLOR_ERROR="\e[37m\e[43m"
COLOR_NOT_VALID="\e[31m"

JS_FILE_PATTERN="\.js$"

# stolen from template file
if git rev-parse --verify HEAD
then
    against=HEAD
else
    # Initial commit: diff against an empty tree object
    against=4b825dc642cb6eb9a060e54bf8d69288fbee4904
fi

# this is the magic:
# retrieve all files in staging area that are added, modified or renamed
# but no deletions etc
FILES=$(git diff-index --name-only --cached --diff-filter=ACMR $against -- )

if [ "$FILES" == "" ]; then
    exit 0
fi

# create temporary copy of staging area
if [ -e $TMP_STAGING ]; then
    rm -rf $TMP_STAGING
fi
mkdir $TMP_STAGING


# match files against whitelist
FILES_TO_CHECK=""
for FILE in $FILES
do
    echo "$FILE" | egrep -q "$JS_FILE_PATTERN"
    RETVAL=$?
    if [ "$RETVAL" -eq "0" ]
    then
        FILES_TO_CHECK="$FILES_TO_CHECK $FILE"
    fi
done

if [ "$FILES_TO_CHECK" == "" ]; then
    commit_valid
fi

# Copy contents of staged version of files to temporary staging area
# because we only want the staged version that will be commited and not
# the version in the working directory
STAGED_FILES=""
for FILE in $FILES_TO_CHECK
do
  ID=$(git diff-index --cached HEAD $FILE | cut -d " " -f4)

  # create staged version of file in temporary staging area with the same
  # path as the original file so that the phpcs ignore filters can be applied
  mkdir -p "$TMP_STAGING/$(dirname $FILE)"
  git cat-file blob $ID > "$TMP_STAGING/$FILE"
  STAGED_FILES="$STAGED_FILES $TMP_STAGING/$FILE"
done

OUTPUT_ESLINT=$(eslint --color $FILES_TO_CHECK)
RETVAL_ESLINT=$?

# delete temporary copy of staging area
rm -rf $TMP_STAGING

if [ $RETVAL_ESLINT -ne 0 ]; then
	if [ $RETVAL_ESLINT -ne 0 ]; then
		echo -e "${COLOR_ERROR} You have JS errors. Fix them ! \033[0m"
		echo "$OUTPUT_ESLINT"
		echo ""
	fi

    commit_not_valid
else
	commit_valid
fi

exit 0