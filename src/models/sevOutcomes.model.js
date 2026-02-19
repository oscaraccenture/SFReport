/* const person = {
  sNo: 1,
  category: "List",
  Role: "N/A",
  'Prompt Type': 'N/A'
}; */

class severalOutcomesModel  {
    constructor(sNo, category, role, promptType, utterance, outcome1, outcome2, outcome3, outcome4, outcome5){
        this.sNo = sNo;
        this.category = category;
        this.role = role;
        this.promptType = promptType;
        this.utterance = utterance ;
        this.outcome1 = outcome1;
        this.outcome2 = outcome2;
        this.outcome3 = outcome3;
        this.outcome4 = outcome4;
        this.outcome5 = outcome5;
    }
}