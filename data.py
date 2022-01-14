import json
import csv

with open('words.json', 'r') as f:
    wordle_words = set(json.load(f))

word_freq_arr = []
with open('word-freq.txt', 'r', encoding='utf8') as f:
    reader = csv.reader(f, delimiter=' ')
    for word, freq in reader:
        if word in wordle_words:
            word_freq_arr.append((int(freq), word))

word_freq_arr.sort()
ordered_words = [word for freq, word in word_freq_arr]

with open('words_freq_ordered.json', 'w') as jf:
    json.dump(ordered_words, jf)
