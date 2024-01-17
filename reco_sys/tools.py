def normalize(data, newMin, newMax):
    minVal = min(data)
    maxVal = max(data)

    normalizedData = [round(((x - minVal) / (maxVal - minVal)) *
                      (newMax - newMin) + newMin) for x in data]
    
    print(normalizedData)
    return (normalizedData)
