i = rand(10)
while 1 do
	puts "Please enter your number"
	a = gets.chomp
	a = a.to_i
	puts "My Number is bigger than yours" if a < i
	puts "My Number is smaller than yours" if a > i
	break if a == i
end

puts "My Number is #{i}"
