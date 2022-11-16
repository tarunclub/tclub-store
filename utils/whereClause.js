class WhereClause {
  constructor(base, bigQuery) {
    this.base = base;
    this.bigQuery = bigQuery;
  }

  search() {
    const searchWord = this.bigQuery.search
      ? {
          name: {
            $regex: this.bigQuery.search,
            $option: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchWord });
    return this;
  }

  pager(resultPerPage) {
    let currentPage = 1;
    if (this.bigQuery.page) {
      currentPage = this.bigQuery.page;
    }

    const skipVal = resultPerPage * (currentPage - 1);

    this.base = this.base.limit(resultPerPage).skip(skipVal);

    return this;
  }

  filter() {
    const copyQuery = { ...this.bigQuery };

    delete copyQuery["search"];
    delete copyQuery["page"];
    delete copyQuery["limit"];

    // convert bigQuery into string
    let stringOfCopyQuery = JSON.stringify(copyQuery);

    stringOfCopyQuery = stringOfCopyQuery.replace(
      /\b(gte | lte | gt | lt)\b/g,
      (m) => `$${m}`
    );

    const jsonOfcopyQuery = JSON.parse(stringOfCopyQuery);

    this.base = this.base.find(jsonOfcopyQuery);

    return this;
  }
}

module.exports = WhereClause;
