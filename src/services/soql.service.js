/* 
The SOQL query used to retrieve the total number of opportunities that are not closed is:

SELECT COUNT(Id) FROM Opportunity WHERE IsClosed = false
 */

function levenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = (s1[i - 1] === s2[j - 1]) ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,      // Deletion
                dp[i][j - 1] + 1,      // Insertion
                dp[i - 1][j - 1] + cost // Substitution
            );
        }
    }
    return dp[m][n];
}

function calculateSimilarityPercentage(paragraph1, paragraph2) {
    const distance = levenshteinDistance(paragraph1, paragraph2);
    const maxLength = Math.max(paragraph1.length, paragraph2.length);
    if (maxLength === 0) return 100; // Both empty, 100% similar
    return ((maxLength - distance) / maxLength) * 100;
}




const soqlQueryComparator = (soqlQuery, soqlQueryExpected) =>{
    const similarity = calculateSimilarityPercentage(soqlQuery, soqlQueryExpected);
    return (similarity.toFixed(2));
}

export {
    soqlQueryComparator
}