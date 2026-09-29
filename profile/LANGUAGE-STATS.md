# Language statistics

The daily profile workflow counts physical source lines with cloc 2.06, downloaded
from its official repository and checked against a pinned SHA-256 digest.

- Scope: current default branches of owned public, non-fork, nonempty repositories.
- Count: code lines, excluding comments and blank lines. This is not coding time,
  authorship attribution, or a count of historical changes.
- Notebook code cells are converted to their declared language (Python by default).
  Markdown cells, outputs, and notebook metadata are not counted.
- Common dependency, environment, build, cache, and generated-code directories are
  excluded before counting. Minified/bundled files, generated declarations, and
  sources with standard generator warnings are also excluded.
- Only source-file extensions in `language-lines.py` are counted. Documentation,
  lockfiles, data, and images are omitted. Unrecognized vendor directory names or
  unmarked generated files may require additional exclusion rules.
- Repositories are downloaded into isolated temporary directories. Their scripts
  are never executed; archive paths and symbolic links are never extracted.
- A failed download/count aborts the refresh, preserving the previous chart.

The displayed chart groups languages beyond the first nine into Other when there
are more than ten languages. All percentages use the complete counted total.
